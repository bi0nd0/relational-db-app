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
                <button class="btn btn-sm btn-primary" @click="onSaveClicked(data())">
                    <font-awesome-icon icon="fa-solid fa-floppy-disk" fixed-width/>
                    <span class="ms-1">Save</span>
                </button>
            </div>
        </template>
    </Form>

</template>

<script setup>
import { ref, toRefs, inject, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import * as settings from '../../settings/'
import Form from '../common/Form/Form.vue'
import ItemsNavigation from './ItemsNavigation.vue'
import store from '../../store'
import {useData} from '../../models/FormField'

const toaster = inject('$toaster')
const modal = inject('$modalManager')

const props = defineProps({
    collection: { type: String, default: '' },
    id: { type: String, default: null }, // this prop is coming from the router
})

const {id, collection} = toRefs(props)

// retrieve the settings for the current collection
const getFields = computed( () => settings?.[collection.value]?.fields)
const fields = ref([])

// load data and assign values to the fields
const loadData = async () => {
    const data = await store.collections.fetchOne(props.collection, props.id)
    // const _fields = getFields?.value()
    // for (const _field of _fields) {
    //     let value = data?.[_field.name]
    //     if(_field instanceof ManyToManyField) value = await _field.fetchData(value)
    //     if(_field instanceof ManyToOneField) value = await _field.fetchData(value)
    //     if(_field instanceof Files) value = await _field.fetchData(value)
    //     _field.setValue(value, false)
    // }
    // fields.value = _fields
    fields.value = await useData(getFields?.value(), data)
}
// trigger loadData whenever there is a change in one of the props
watchEffect(loadData)

async function onCancelClicked() {
    const confirmed = await modal.confirm({title:'Confirm', body:'Are you sure you want to leave this page?'})
    if(!confirmed) return
    goToList()
}

async function onSaveClicked(data) {
    try {
        await store.collections.updateOne(collection.value, id.value, data)
        toaster.toast({title:'Success', body:'Data was saved successfully'}, 'top right')
        goToList()
    } catch (error) {
        toaster.toast({title:'Error', body: error}, 'top right')
    }
}

const router = useRouter()
function goToList() {
    router.push({name: 'listItems', params: { collection: collection.value }})
}

</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>