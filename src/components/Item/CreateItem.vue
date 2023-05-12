<template>
    <Form :fields="fields">
        <template v-slot:footer="{data}">
            <div class="buttons">
                <button class="btn btn-sm btn-secondary" @click="onCancelClicked()">
                    <font-awesome-icon icon="fa-solid fa-xmark" fixed-width/>
                    <span class="ms-1">Cancel</span>
                </button>
                <button class="btn btn-sm btn-primary" @click="onSaveClicked(data)">
                    <font-awesome-icon icon="fa-solid fa-floppy-disk" fixed-width/>
                    <span class="ms-1">Save</span>
                </button>
            </div>
        </template>
    </Form>
    
</template>

<script setup>
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {directus} from '../../API'
import Form from '../common/Form/Form.vue'
import * as settings from '../../settings/'

const toaster = inject('$toaster')
const modal = inject('$modalManager')

const route = useRoute()
const router = useRouter()


const props = defineProps({
    collection: { type: String, default: '' }
})

const collection = ref('')
const fields = ref([])

// watch the route and update data based on the collection param
watch(route, () => {
    // infer the collection from the route
    collection.value = route.params?.collection
    if(!collection.value) return
    // retrieve the settings
    const itemSettings = settings[collection.value]
    // define the subset of fields you need to view in the table
    const collectionFields = itemSettings.fields()
    // define the subset of fields you need to view in the table
    fields.value = collectionFields
}, {immediate: true, deep: true})

async function onCancelClicked() {
    const confirmed = await modal.confirm({title:'Confirm', body:'Are you sure you want to leave this page?'})
    if(!confirmed) return
    goToList()
}
function onSaveClicked(data) {
    save(data())
}
function goToList() {
    router.push({name: 'listItems', params: { collection: collection.value }})
}
async function save(data) {
    try {
        const response = await directus.items(collection.value).createOne(data)
        toaster.toast({title:'Success', body:'Data was saved successfully'}, 'top right')
        goToList()
    } catch (error) {
        console.error(error)
        toaster.toast({title:'Error', body: error}, 'top right')
    }
}

</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>