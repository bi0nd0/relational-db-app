<template>
    <header class="mb-2 d-flex">
        <router-link :to="createLink" custom v-slot="{ isActive, href, navigate }">
            <button class="btn btn-sm btn-primary" @click="navigate">
                <font-awesome-icon icon="fa-solid fa-plus" fixed-width/>
                <span class="ms-1">New</span>
            </button>
        </router-link>
        <div class="ms-auto d-flex align-items-center gap-2">
            <template v-if="loading">
                <font-awesome-icon icon="fa-solid fa-spinner" spin fixed-width/>
                <span>Loading...</span>
            </template>
        </div>
    </header>


    <Table class="w-100 my-2" :items="items" :fields="fields">

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

    
    <div class="d-flex gap-2">
        <b-pagination v-model="page" :perPage="limit" :totalItems="totalItems"/>
        <SelectPageSize v-model="limit" :options="[5,10,25,50,100]"/>
    </div>

</template>

<script setup>
import { ref, computed, watch, inject, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as settings from '../../settings/'
import Table from '../common/Table/Table.vue'
import store from '../../store'
import SelectPageSize from '../common/SelectPageSize.vue'

const loading = ref(false)

// pagination
const page = ref(1)
const limit = ref(25)
const totalItems = computed( () => metadata.value?.filter_count )
const totalPages = computed( () => Math.ceil(metadata.value?.filter_count/limit.value) )

const props = defineProps({
    collection: { type: String, default: '' },
})

const route = useRoute()
const router = useRouter()
// infer the collection from the route
const collection = ref('')
const items = ref([])
const metadata = ref({total_count:0, filter_count:0})
const fields = ref([])

const toaster = inject('$toaster')
const modal = inject('$modalManager')

// return to page 1 if not enough elements after limit changes
/* watchEffect(() => {
    if(totalPages.value>0 && page.value>totalPages.value) page.value = totalPages.value
}) */

// watch the route and update data based on the collection param
watch(route, async () => {
    collection.value = route.params?.collection
    if(!collection.value) return
    // retrieve the settings
    const itemSettings = settings[collection.value]
    // define the subset of fields you need to view in the table
    const collectionFields = itemSettings.tableFields()
    fields.value = collectionFields
    if(page.value != 1) page.value = 1
    else fetchData()
}, {immediate: true, deep: true})

watch(page, async (_page) => {
    fetchData()
}, {immediate: true})

const createLink = computed( ()=> ( { name: 'createItem', params: { collection:collection.value } } ) )

async function fetchData() {
    try {
        loading.value = true
        const response = await store.collections.fetchAll(collection.value, page.value, limit.value)
        const {data=[], meta={total_count:0, filter_counf:0}} = response
        items.value = data
        metadata.value = meta
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

async function deleteItem(item) {
    const {id} = item
    await store.collections.deleteOne(collection.value, id)
    if(items.value.length<=1) {
        if(page.value>1) page.value = page.value-1 // go to previous page if no more elements
    }
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