<template>
    <div class="mb-2">
        <ItemsNavigation :collection="collection" :id="id"/>
    </div>
    <h2>Edit item ID #{{ id }}</h2>

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
import { ref, watch, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {directus} from '../../API'
import * as settings from '../../settings/'
import Form from '../common/Form/Form.vue'
import ItemsNavigation from './ItemsNavigation.vue'
import store from '../../store'

const props = defineProps({
    collection: { type: String, default: '' },
    id: { type: String, default: null }, // this prop is coming from the router
})
const {id, collection} = toRefs(props)

const route = useRoute()
const router = useRouter()


const fields = ref([])
const item = ref({})


// watch the route and update data based on the collection param
watch(route, async () => {
    if(!collection.value) return
    // retrieve the settings
    const itemSettings = settings[collection.value]
    // define the subset of fields you need to view in the table
    const collectionFields = itemSettings.fields()
    fields.value = collectionFields

    // use an instant timeout to make sure the item will update
    setTimeout(async () => {
        item.value = await store.collections.getItem(collection.value, id.value)
    }, 0);
}, {immediate: true, deep: true})

watch(item, (_item) => {
    fields.value.forEach(field => {
        field.value = _item?.[field.name]
    });
},{immediate: true, deep:true})


function onCancelClicked() {
    const confirmed = confirm('Are you sure you want to leave this page?')
    if(!confirmed) return
    goToList()
}
function onSaveClicked(form) {
    save(form)
}
function goToList() {
    router.push({name: 'listItems', params: { collection: collection.value }})
}
async function save(data) {
    try {
        const response = await directus.items(collection.value).updateOne(id.value, data)
        // console.log(response)
        alert('saved successfully')
        goToList()
    } catch (error) {
        console.error(error)
        alert(error)
    }
}
</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>