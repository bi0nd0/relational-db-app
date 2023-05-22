<template>
<slot name="label">
    <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
</slot>

<div class="border rounded p-2" :id="`field-${field.name}`">
    <div class="d-flex flex-column gap-2">
        <template v-for="(item, index) in items" :key="item">
            <div class="d-flex border rounded p-2">
                <template v-if="(typeof preview == 'function')">
                    <div v-html="preview(item)"></div>
                </template>
                <template v-else>
                    <div v-html="item?.id ?? '--'"></div>
                </template>
                <div class="ms-auto">
                    <button class="btn btn-danger btn-sm" @click="onRemoveClicked(item)">
                        <font-awesome-icon icon="fa-solid fa-trash" fixed-width/>
                    </button>
                </div>
            </div>
        </template>
    </div>

    <div class="d-flex gap-2 mt-2">
        <button class="btn btn-sm btn-primary" @click="onCreateNewClicked">
            <font-awesome-icon icon="fa-solid fa-plus" fixed-width/>
            <span class="ms-1">Create New</span>
        </button>
        <button class="btn btn-sm btn-primary" @click="onAddExistingClicked">
            <font-awesome-icon icon="fa-solid fa-list" fixed-width/>
            <span class="ms-1">Add Existing</span>
        </button>
    </div>
</div>

<Drawer ref="createNewRef">
    <template #header>Create new</template>
    <div>
        <MyForm :fields="newItemFields" />
    </div>
</Drawer>

<Drawer ref="addExistingRef">
    <template #header>Add existing</template>
    <SelectExisting :collection="related" :useQuery="useQuery" v-slot="{items}">
        <template v-for="(item, index) in items" :key="items?.id ?? index">
            <div class="d-flex border-bottom">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" :id="`existing-${item.id}`" :value="item" v-model="selected">
                    <label :for="`existing-${item.id}`">
                        <template v-if="(typeof preview == 'function')">
                            <span v-html="preview(item)"></span>
                        </template>
                        <template v-else>
                            <span v-html="item?.id ?? '--'"></span>
                        </template>
                    </label>
                </div>
            </div>
        </template>
    </SelectExisting>
</Drawer>

</template>

<script setup>
import FormField from '@/models/FormField'
import { ref, toRefs, computed, defineAsyncComponent, toRaw, onMounted } from 'vue'
import SelectExisting from './SelectExisting.vue';

const MyForm = defineAsyncComponent(() => import('./Form.vue'))

const emit = defineEmits([ 'update:modelValue' ])
const props = defineProps({
    modelValue: { type: [Array,Object], default: () => ([]) }, // v-model
    field: { type: FormField, default: null },
})
const { modelValue, field } = toRefs(props)
// extract properties from the field settings
const {related, foreign_key, preview, filter} = field.value

const items = computed( () => {
    return modelValue.value.map(item => toRaw(item?.[foreign_key]))
})

const useQuery = (query) => {
    const params = {}
    params.filter = filter(query) // apply filter if a query is set
    const existingIDs = currentIDs.value
    if(existingIDs.length>0) {
        params.filter.id = {
            _nin: currentIDs.value 
        }
    }
    return params
}

function updateModelValue(_items=[]) {
    const serialized = _items.map( item => ({[foreign_key]:item}) ) 
    emit('update:modelValue', serialized)
}

/**
 * modelValue is the payload with the ids:
 * - id (relation ID)
 * - parent_id
 * - item_id
 */

const createNewRef = ref()
const newItemFields =ref([])

const addExistingRef = ref()
const selected = ref([])

const currentIDs = computed( () => {
    const _ids = []
    for (const _item of items.value) {
        if(_item?.id) _ids.push(_item.id)
    }
    return _ids
})

async function addExisting() {
    const _items = [...items.value]
    const _selectedItems = selected.value
    if(_selectedItems.length===0) return
    for (const _item of _selectedItems) {
        _items.push(_item)
    }
    updateModelValue(_items)
}

function addNew() {
    const fields = newItemFields.value
    const _data = {}
    const _items = [...items.value]
    
    for (const field of fields) {
        if(!field.dirty) continue
        _data[field.name] = field.value
    }
    _items.push(_data)
    updateModelValue(_items)
}

/**
 * search and remove one of the possible items as available in the modelValue:
 * number, object with ID, and object without ID
 * @param {Object} itemToRemove 
 */
function remove(itemToRemove) {
    const _items = [...items.value]
    const index = _items.indexOf(itemToRemove)
    if(index<0) return
    _items.splice(index, 1)
    updateModelValue(_items)
}

/**
 * remove the item from both
 * the ids (triggering the v-model update)
 * and from the items
 * @param {Object} itemToRemove 
 */
function onRemoveClicked(item) { remove(item) }

async function onCreateNewClicked() {
    newItemFields.value = field.value.fields() // reset
    const response = await createNewRef.value.show()
    if(response===false) return
    else addNew()
}

async function onAddExistingClicked() {
    selected.value = [] // reset ids
    const response = await addExistingRef.value.show()
    if(response===false) return
    else addExisting()

}

</script>

<style scoped>
.item {
    border: solid 1px rgb(0 0 0 / 0.15);
}
</style>