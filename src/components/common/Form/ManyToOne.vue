<template>
    <slot name="label">
        <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
    </slot>
    <template v-if="item">
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
            <div class="d-flex ms-auto gap-2">
                <button class="btn btn-sm btn-light ms-auto" @click="onSelectExistingClicked">
                    <font-awesome-icon :icon="['fa-solid', 'up-right-from-square']" fixed-width/>
                </button>
                <button class="btn btn-sm btn-light text-danger ms-auto" @click="onRemoveClicked">
                    <font-awesome-icon icon="fa-solid fa-trash" fixed-width/>
                </button>
            </div>

        </div>
        <slot :item="item"></slot>
    </template>
    <template v-else>
        <div class="buttons d-flex gap-2 border border-muted rounded p-2">
            <button class="btn btn-sm btn-primary" @click="onCreateNewClicked">
                <font-awesome-icon icon="fa-solid fa-plus" fixed-width/>
                <span class="ms-1">Create New</span>
            </button>
            <button class="btn btn-sm btn-primary" @click="onSelectExistingClicked">
                <font-awesome-icon icon="fa-solid fa-list" fixed-width/>
                <span class="ms-1">Select Existing</span>
            </button>
        </div>
    </template>


    <Drawer ref="createNewRef">
        <template v-slot:header>
            <span>Create item</span>
        </template>

        <MyForm :fields="newItemFields"></MyForm>
    </Drawer>

    <Drawer ref="addExistingRef">
        <template v-slot:header><span>Select item</span></template>
        <SelectExisting :collection="related" :useQuery="useQuery" v-slot="{items}">
            <template v-for="(item, index) in items" :key="index">
                <div class="card mt-2">
                    <div class="preview card-body">
                        <input class="form-check-radio" :id="`select-${item.id}`" type="radio" v-model="selected" :value="item"/>
                        <label class="form-check-label ms-2" :for="`select-${item.id}`">
                            <template v-if="typeof preview == 'function'">
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
import { ref, toRefs, computed, defineAsyncComponent, reactive } from 'vue'
import SelectExisting from './SelectExisting.vue';

const MyForm = defineAsyncComponent(() => import('../Form/Form.vue'))

const emit = defineEmits([ 'update:modelValue' ])
const props = defineProps({
    modelValue: { type: [Object, Number], default: null }, // v-model
    field: { type: FormField, default: null },
})

// const items = ref([]) // list selected items (numeric form)
// const item = ref() // related item
const { modelValue, field } = toRefs(props)
const {
    related, // name of the collection relation
    foreign_key, // field for the connection
    preview, // function used to preview the item
    filter, // filter function used when searching for an item by text
} = field.value


const createNewRef = ref(null) // reference an item in the template
const addExistingRef = ref(null) // reference an item in the template
const selected = ref()

const item = computed( () => {
    return modelValue.value
})

// data for creating new items
const newItemFields = ref([])

const useQuery = (query) => {
    const params = {}
    params.filter = filter(query) // apply filter if a query is set
    const existingID = item.value?.id
    if(existingID) {
        params.filter.id = {
            _nin: [existingID] 
        }
    }
    return params
}

async function selectExisting() {
    const _item = selected.value
    if(!_item) return
    // item.value = data
    emit('update:modelValue', _item)
}
function addNew() {
    const fields = newItemFields.value
    const _data = {}
    
    for (const field of fields) {
        if(!field.dirty) continue
        _data[field.name] = field.value
    }
    // item.value = data
    emit('update:modelValue', _data)
}
/**
 * search and remove one of the possible items as available in the modelValue:
 * number, object with ID, and object without ID
 * @param {Object} itemToRemove 
 */
function remove() {
    // item.value = null // mark the metaitem as deleted
    emit('update:modelValue', null)
}

/**
 * remove the item from both
 * the ids (triggering the v-model update)
 * and from the items
 * @param {Object} itemToRemove 
 */
function onRemoveClicked(item) { remove()}

async function onCreateNewClicked() {
    newItemFields.value = field.value.fields() // reset
    const response = await createNewRef.value.show()
    if(response===false) return
    else addNew()
}
async function onSelectExistingClicked() {
    selected.value = null // reset id
    const response = await addExistingRef.value.show()
    if(response===false) return
    else selectExisting()

}


</script>

<style scoped>
.item {
    border: solid 1px rgb(0 0 0 / 0.15);
}
</style>