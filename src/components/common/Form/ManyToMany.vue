<template>
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
<!-- {{ modelValue }} -->
{{ data }}
<button @click="onCreateNewClicked">create new</button>
<button @click="onAddExistingClicked">add existing</button>

<!-- <pre>
    <div>{{ payload }}</div>

    <div>{{ field }}</div>
</pre> -->


<b-modal ref="createNewRef">
    <template #header>Create new</template>
    <div>
        <MyForm v-model="newItemFields" :fields="newItemFields" />
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
/**
 * A relation could be displayed as a number or an object;
 * the object contains an ID when updating and no ID when creating.
 * 
 * @see https://docs.directus.io/reference/introduction.html#relational-data
 * 
 * - number: ID of the associated item
 * - object with no ID: newly created item; will be saved if associated
 * - object with ID: object that has been updated; will be updated when associated
 * 
 * example:
 *   [
 *    1,
 *    2,
 *    {
 *        name: 'john'
 *    },
 *    {
 *        id: 5,
 *        name: 'jane'
 *    },
 *    6
 *   ]
 */

const MyForm = defineAsyncComponent(() => import('./Form.vue'))

const emit = defineEmits([ 'update:modelValue' ])
const props = defineProps({
    modelValue: { type: [Array,Object], default: () => ([]) }, // v-model
    field: { type: FormField, default: null },
})
const {modelValue, field} = toRefs(props)
// extract properties from the field settings
const {related, foreign_key, preview, filter} = field.value

// items displayed in the template
const items = ref([])

watch(field, async (_field) => {
    console.log('watch field in manytomany',_field)
    const initialValue = _field?.initialValue
    if(!initialValue) return
    if(!foreign_key) throw new Error(`Foreign key not defined`)
    const _ids = []
    const _objects = []
    for (const _data of [..._field?.initialValue]) {
        if(foreign_key in _data) _ids.push(_data[foreign_key])
        else _objects.push(_data)
    }
    const _data = await fetchIDs(_ids)
    // console.log([..._data, ..._objects])
    items.value = [..._data, ..._objects]
}, {immediate: true})


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
    for (const _item of items.value) {
        if(_item?.id) _ids.push(_item.id)
    }
    return _ids
})
const data = computed( () => {
    const _data = []
    
    // const initialIDs = relations.map(_relation => _relation?.[id])
    for (const item of items.value) {
        const relationID = getRelationID(item)
        if(relationID) _data.push(relationID) // existing relation
        else _data.push({[foreign_key]:item}) // new item (existing or not)
    }
    return _data
} )

// check if an element is related to the parent
function getRelationID(element) {
    const relations = field.value.initialValue
    const found = relations.find( _relation => _relation.id === element.id )
    return found?.relationID
}

async function fetchIDs(ids=[]) {
    if(ids.length==0) return []
    // make a request filtering by id
    const response = await directus.items(related).readByQuery({
        filter: {
            id: {
                _in: ids
            }
        },
        limit: -1
    })
    const {data:_data=[]} = response
    return _data
}



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
    _items.forEach(_item => {
        items.value.push(_item)
    })
    emit('update:modelValue', toRaw(data))
}
function addNew() {
    const fields = newItemFields.value
    const _data = {}
    
    for (const field of fields) {
        if(!field.dirty) continue
        _data[field.name] = field.value
    }

    items.value.push(_data)
    emit('update:modelValue', toRaw(data))
}
/**
 * search and remove one of the possible items as available in the modelValue:
 * number, object with ID, and object without ID
 * @param {Object} itemToRemove 
 */
function remove(itemToRemove) {
    const index = items.value.indexOf(itemToRemove)
    if(index<0) return
    items.value.splice(index, 1)
    emit('update:modelValue', toRaw(data))
}

/**
 * remove the item from both
 * the ids (triggering the v-model update)
 * and from the items
 * @param {Object} itemToRemove 
 */
function onRemoveClicked(item) { remove(toRaw(item))}
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