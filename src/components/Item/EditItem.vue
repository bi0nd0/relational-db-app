<template>
    <div class="mb-2">
        <ItemsNavigation :collection="collection" :id="id"/>
    </div>
    <h2>Edit item ID #{{ id }}</h2>

    <EditItem :collection="collection" :id="id" :fieldsGenerator="collectionSettings.fields" @save="onSaved" @error="onError">
        <template v-slot="{ fields, save }">
            <Form :fields="fields">
                <template v-slot:footer="{data}">
                    <div class="buttons">
                        <button class="btn btn-sm btn-secondary" @click="onCancelClicked()">
                            <font-awesome-icon icon="fa-solid fa-xmark" fixed-width/>
                            <span class="ms-1">Cancel</span>
                        </button>
                        <button class="btn btn-sm btn-primary" @click="save(data())">
                            <font-awesome-icon icon="fa-solid fa-floppy-disk" fixed-width/>
                            <span class="ms-1">Save</span>
                        </button>
                    </div>
                </template>
            </Form>
        </template>
    </EditItem>
 
</template>

<script setup>
import { toRefs, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as settings from '../../settings/'
import Form from '../common/Form/Form.vue'
import ItemsNavigation from './ItemsNavigation.vue'
import EditItem from '../Renderless/EditItem.vue'

const toaster = inject('$toaster')
const modal = inject('$modalManager')

const props = defineProps({
    collection: { type: String, default: '' },
    id: { type: String, default: null }, // this prop is coming from the router
})
const {id, collection} = toRefs(props)

const router = useRouter()

// retrieve the settings for the current collection
const collectionSettings = computed( () => settings?.[collection.value])

async function onCancelClicked() {
    const confirmed = await modal.confirm({title:'Confirm', body:'Are you sure you want to leave this page?'})
    if(!confirmed) return
    goToList()
}
function goToList() {
    router.push({name: 'listItems', params: { collection: collection.value }})
}

async function onSaved(response) {
    toaster.toast({title:'Success', body:'Data was saved successfully'}, 'top right')
    goToList()
}

function onError(error) {
    console.error(error)
    toaster.toast({title:'Error', body: error}, 'top right')
}

</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>