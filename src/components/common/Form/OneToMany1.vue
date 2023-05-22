<template>
    <slot name="label">
        <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
    </slot>
    <div class="card">
        <div class="card-body items d-flex flex-column gap-2">
            <template v-for="(item, index) in items" :key="item.id">
                <div class="item d-flex p-2">
                    <div class="preview">

                        <template v-if="typeof preview == 'function'">
                            {{ preview(item) }}
                        </template>

                        <template v-else>
                            <span>{{ item.id }}</span>
                        </template>
                    </div>

                    <button class="btn btn-sm btn-danger ms-auto" @click="onRemoveClicked(item)">
                        <font-awesome-icon icon="fa-solid fa-trash" fixed-width/>
                    </button>

                </div>
                <slot :item="item"></slot>
            </template>

            <div class="buttons d-flex gap-2">
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

    </div>

    <Drawer ref="createDrawer">
        <template v-slot:header>
            <span>Create item</span>
        </template>

        <MyForm :fields="newItemFields" v-model="newItem">
        </MyForm>
    </Drawer>

    <Drawer ref="selectDrawer">
        <template v-slot:header>
            <span>Select item</span>
        </template>
        <SelectExisting :collection="related" :useQuery="useQuery" v-slot="{items}">
            <template v-for="(item, index) in items" :key="index">
                <div class="card mt-2">
                    <div class="preview card-body">
                        <input class="form-check-input" :id="`select-${item.id}`" type="checkbox" v-model="selected" :value="item"/>
                        <!-- run the preview function if available -->
                        <label class="form-check-label ms-2" :for="`select-${item.id}`">
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
import { ref, toRefs, computed, defineAsyncComponent, toRaw } from 'vue'
import SelectExisting from './SelectExisting.vue';

const MyForm = defineAsyncComponent(() => import('./Form.vue'))


const emit = defineEmits([ 'update:modelValue' ])
const props = defineProps({
    modelValue: { type: [Array,Object], default: () => ([]) }, // v-model
    field: { type: FormField, default: null },
})

const { modelValue, field } = toRefs(props)
const {
    related, // name of the collection relation
    foreign_key, // field for the connection
    preview, // function used to preview the item
    filter, // filter function used when searching for an item by text
} = field.value

const items = computed( () => {
    return modelValue.value.map(item => toRaw(item?.[foreign_key]))
})

function updateModelValue(_items=[]) {
    const serialized = _items.map( item => ({[foreign_key]:item}) ) 
    emit('update:modelValue', serialized)
}

const createDrawer = ref(null) // reference an item in the template

const selectDrawer = ref(null) // reference an item in the template

const selected = ref([])

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

const currentIDs = computed( () => {
    const _ids = []
    for (const _item of items.value) {
        if(_item?.id) _ids.push(_item.id)
    }
    return _ids
})

// data for creating new items
const newItemFields = ref({})
const newItem = ref({})

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
    // todo: get data directly from the form in the creation drawer
    const _data = newItem.value
    if(!_data) return
    const _items = [...items.value]
    _items.value.push(_data)
    updateModelValue(_items)
}
/**
 * search and remove one of the possible items as available in the modelValue:
 * number, object with ID, and object without ID
 * @param {Object} itemToRemove 
 */
function remove(item) {
    const _items = [...items.value]
    const index = _items.indexOf(item)
    if(index<0) return
    _items.splice(index, 1)
    updateModelValue(_items)
}
/* function restore(item) {
    item.deleted = false // mark the metaitem as deleted
} */
/**
 * remove the item from both
 * the ids (triggering the v-model update)
 * and from the items
 * @param {Object} itemToRemove 
 */
function onRemoveClicked(item) { remove(item)}
async function onCreateNewClicked() {
    newItemFields.value = field.value.fields() // reset
    const response = await createDrawer.value.show()
    if(response===false) return
    else addNew()
}
async function onAddExistingClicked() {
    selected.value = [] // reset ids
    const response = await selectDrawer.value.show()
    if(response===false) return
    else addExisting()
}
function onSearchClicked() { search() }

const test = ref({})


</script>

<style scoped>
.item {
    border: solid 1px rgb(0 0 0 / 0.15);
}
</style>