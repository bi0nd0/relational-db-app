<template>
    <slot name="label">
        <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
    </slot>
    <div class="card">
        <div class="card-body items d-flex flex-column gap-2">
            <template v-for="(item, index) in items" :key="index">
                <div class="item d-flex p-2">
                    <div class="preview">
                        <!-- run the preview function if available -->
                        <template v-if="typeof preview == 'function'">
                            {{ preview(item) }}
                        </template>
                        <!-- show the id otherwise -->
                        <template v-else>
                            <span>{{ item.id }}</span>
                        </template>
                    </div>
                    <!-- <template v-if="item.deleted">
                        <button class="btn btn-sm btn-info ms-auto" @click="onRestoreClicked(item)">
                            <font-awesome-icon icon="fa-solid fa-rotate-left" fixed-width/>
                        </button>
                    </template> -->
                    <!-- <template v-else> -->
                        <button class="btn btn-sm btn-danger ms-auto" @click="onRemoveClicked(item)">
                            <font-awesome-icon icon="fa-solid fa-trash" fixed-width/>
                        </button>
                    <!-- </template> -->
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

    <!-- {{ newItem }} -->
    <!-- {{ items }} -->
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

            <div>
                <div class="input-group">
                    <input class="form-control" type="text" v-model.lazy="query" placeholder="3 characters min..."/>
                    <button class="btn btn-sm btn-primary" @click="onSearchClicked">
                        <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width/>
                        <span class="ms-1">Search</span>
                    </button>
                </div>
            </div>
        </template>
        <div>
            <template v-for="(item, index) in results" :key="index">
                <div class="card mt-2">
                    <div class="preview card-body">
                        <input class="form-check-input" :id="`select-${item.id}`" type="checkbox" v-model="selectedIDs" :value="item.id"/>
                        <!-- run the preview function if available -->
                        <label class="form-check-label ms-2" :for="`select-${item.id}`">
                            <template v-if="typeof preview == 'function'">
                                {{ preview(item) }}
                            </template>
                            <!-- show the id otherwise -->
                            <template v-else>
                                <span>{{ item.id }}</span>
                            </template>
                        </label>
                    </div>
                </div>
            </template>
        </div>
    </Drawer>

</template>

<script setup>
import FormField from '@/models/FormField'
import { ref, toRefs, computed, watch, defineAsyncComponent } from 'vue'
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



const MyForm = defineAsyncComponent(() => import('../Form.vue'))


const emit = defineEmits([ 'update:modelValue' ])
const props = defineProps({
    modelValue: { type: [Array,Object], default: () => ([]) }, // v-model
    field: { type: FormField, default: null },
})



const items = ref([]) // list selected items (numeric form)
const { modelValue, field } = toRefs(props)
const {
    related, // name of the collection relation
    foreign_key, // field for the connection
    preview, // function used to preview the item
    filter, // filter function used when searching for an item by text
} = field.value


const createDrawer = ref(null) // reference an item in the template

const selectDrawer = ref(null) // reference an item in the template

const selectedIDs = ref([])
/**
 * observe the model (list of ids) once.
 * for each item, make a list of IDs and create MetaItems
 */
const unwatch = watch(modelValue, async (value) => {
    items.value = value
})

const data = computed( () => {
    const _data = []
    items.value.forEach(element => {
        _data.push(element)
    })
    return _data
} )

const currentIDs = computed(() => {
    const _ids = []
    items.value.forEach(item => {
        const id = item?.value?.id
        if(id) _ids.push(id)
    })
    return _ids
})

const query = ref('')
const results = ref([])

// data for creating new items
const newItemFields = ref({})
const newItem = ref({})

async function fetchIDs(ids=[]) {
    if(ids.length==0) return
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
    results.value = _data
}
async function addExisting() {
    const _ids = selectedIDs.value
    if(_ids.length===0) return
    const _data = await fetchIDs(_ids)
    _data.forEach(element => {
        items.value.push(element)
    })
    emit('update:modelValue', data.value)
}
function addNew() {
    // todo: get data directly from the form in the creation drawer
    const _data = newItem.value
    if(!_data) return
    items.value.push(_data)
    emit('update:modelValue', data.value)
}
/**
 * search and remove one of the possible items as available in the modelValue:
 * number, object with ID, and object without ID
 * @param {Object} itemToRemove 
 */
function remove(item) {
    const index = items.value.indexOf(item)
    if(index<0) return
    items.value.splice(index, 1)
    emit('update:modelValue', data.value)
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
function onRestoreClicked(item) { restore(item) }
async function onCreateNewClicked() {
    newItemFields.value = field.value.fields() // reset
    const response = await createDrawer.value.show()
    if(response===false) return
    else addNew()
}
async function onAddExistingClicked() {
    selectedIDs.value = [] // reset ids
    query.value = '' // reset query
    await search()
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