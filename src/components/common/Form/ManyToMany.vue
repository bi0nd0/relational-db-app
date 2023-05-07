<template>
<div class="border rounded p-2">
    <div class="d-flex flex-column gap-2">
        <template v-for="(item, index) in modelValue" :key="item">
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
        <button class="btn btn-primary btn-sm" @click="onCreateNewClicked">create new</button>
        <button class="btn btn-primary btn-sm" @click="onAddExistingClicked">add existing</button>
    </div>
</div>

<b-modal ref="createNewRef">
    <template #header>Create new</template>
    <div>
        <MyForm :fields="newItemFields" />
    </div>
</b-modal>

<b-modal ref="addExistingRef">
    <template #header>Add existing</template>
    <div>
        <div><input type="text" v-model="query" /></div>
        <div>
            <template v-for="(item, index) in existingItems" :key="existingItems?.id ?? index">
                <div class="d-flex">
                    <div class="me-2">
                        <input type="checkbox" v-model="selected" :value="item" :id="`existing-${item.id}`"/>
                    </div>
                    <label :for="`existing-${item.id}`">
                        <template v-if="(typeof preview == 'function')">
                            <span v-html="preview(item)"></span>
                        </template>
                        <template v-else>
                            <span v-html="item?.id ?? '--'"></span>
                        </template>
                    </label>
                </div>
            </template>
        </div>
    </div>
</b-modal>

</template>

<script setup>
import FormField from '@/models/FormField'
import { ref, toRefs, computed, watch, defineAsyncComponent, toRaw, onMounted } from 'vue'
import {directus} from '@/API/'

const MyForm = defineAsyncComponent(() => import('./Form.vue'))

const emit = defineEmits([ 'update:modelValue' ])
const props = defineProps({
    modelValue: { type: [Array,Object], default: () => ([]) }, // v-model
    field: { type: FormField, default: null },
})
const { modelValue, field } = toRefs(props)
// extract properties from the field settings
const {related, foreign_key, preview, filter} = field.value


watch(modelValue, (_value) => {
    emit('update:modelValue', _value)
}, { immediate: true, deep: true })

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
const existingItems = ref([]) // this is used in the modal
const query = ref('')

const currentIDs = computed( () => {
    const _ids = []
    for (const _item of modelValue.value) {
        if(_item?.id) _ids.push(_item.id)
    }
    return _ids
})

async function search() {
    const text = query.value
    const params = { limit: -1 } // default params
    params.filter = filter(text) // apply filter if a query is set
    const existingIDs = currentIDs.value
    if(existingIDs.length>0) {
        params.filter.id = {
            _nin: currentIDs.value 
        }
    }
    const response = await directus.items(related).readByQuery(params)
    const {data:_data=[]} = response
    existingItems.value = _data
}
async function addExisting() {
    const _items = selected.value
    if(_items.length===0) return
    for (const _item of _items) {
        modelValue.value.push(_item)
    }
}

function addNew() {
    const fields = newItemFields.value
    const _data = {}
    
    for (const field of fields) {
        if(!field.dirty) continue
        _data[field.name] = field.value
    }
    modelValue.value.push(_data)
}

/**
 * search and remove one of the possible items as available in the modelValue:
 * number, object with ID, and object without ID
 * @param {Object} itemToRemove 
 */
function remove(itemToRemove) {
    const index = modelValue.value.indexOf(itemToRemove)
    if(index<0) return
    modelValue.value.splice(index, 1)
    // emit('update:modelValue', toRaw(data))
}

/**
 * remove the item from both
 * the ids (triggering the v-model update)
 * and from the items
 * @param {Object} itemToRemove 
 */
function onRemoveClicked(item) { remove(toRaw(item)) }

async function onCreateNewClicked() {
    newItemFields.value = field.value.fields() // reset
    const response = await createNewRef.value.show()
    if(response===false) return
    else addNew()
}

async function onAddExistingClicked() {
    selected.value = [] // reset ids
    query.value = '' // reset query
    await search()
    const response = await addExistingRef.value.show()
    if(response===false) return
    else addExisting()

}

function onSearchClicked() { search() }

</script>

<style scoped>
.item {
    border: solid 1px rgb(0 0 0 / 0.15);
}
</style>