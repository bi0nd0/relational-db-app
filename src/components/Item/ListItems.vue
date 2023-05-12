<template>
    <header class="mb-2">
        <router-link :to="createLink" custom v-slot="{ isActive, href, navigate }">
            <button class="btn btn-sm btn-primary" @click="navigate">
                <font-awesome-icon icon="fa-solid fa-plus" fixed-width/>
                <span class="ms-1">New</span>
            </button>
        </router-link>
    </header>

    <Table class="w-100" :items="items" :fields="fields">

        <!-- dynamically assigna labels to each thead -->
        <!-- <template v-for="(field, index) in fields" :key="index" #[`head(${field.key})`] >
            {{ field.label ? field.label : field.key }}
        </template> -->

        <template #cell(actions)="{item, field, value}" >
            <div class="actions">
                <button title="edit" class="btn btn-sm btn-light" @click="onEditClicked(item)">
                    <font-awesome-icon icon="fa-solid fa-pencil" fixed-width/>
                </button>
                <button title="delete" class="btn btn-sm btn-light text-danger" @click="onDeleteClicked(item)">
                    <font-awesome-icon icon="fa-solid fa-trash" fixed-width/>
                </button>
            </div>
        </template>
    </Table>

</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {directus} from '../../API/'
import * as settings from '../../settings/'
import Table from '../common/Table/Table.vue'
import store from '../../store'

const props = defineProps({
    collection: { type: String, default: '' },
})

const route = useRoute()
const router = useRouter()
// infer the collection from the route
const collection = ref('')
const items = ref([])
const fields = ref([])

const toaster = inject('$toaster')
const modal = inject('$modalManager')


// watch the route and update data based on the collection param
watch(route, async () => {
    collection.value = route.params?.collection
    if(!collection.value) return
    // retrieve the settings
    const itemSettings = settings[collection.value]
    // define the subset of fields you need to view in the table
    const collectionFields = itemSettings.tableFields()
    fields.value = collectionFields
    items.value = await store.collections.getCollection(collection.value, true)
}, {immediate: true, deep: true})

const createLink = computed( ()=> ( { name: 'createItem', params: { collection:collection.value } } ) )

async function fetchData() {
    const response = await directus.items(collection.value).readByQuery({limit: -1})
    const {data=[]} = response
    items.value = data
    store.collections.setCollection(collection.value, data)
}
async function deleteItem(item) {
    const {id} = item
    await directus.items(collection.value).deleteOne(id)
    fetchData()
}
function onEditClicked(item) {
    router.push({name: 'editItem', params: { id: item.id, collection:collection.value }})
}
async function onDeleteClicked(item) {
    const confirmed = await modal.confirm({title:'Confirm', body:'Are you sure you want to delete this item?'})
    if(confirmed) deleteItem(item)
}


</script>

<style scoped>
.actions {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
}
</style>