<template>

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
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import Form from '../common/Form/Form.vue'
import * as settings from '../../settings/'
import store from '../../store'

const toaster = inject('$toaster')
const modal = inject('$modalManager')

const props = defineProps({
    collection: { type: String, default: '' }, // from the route
})

// retrieve the settings
const fields = computed( () => settings?.[props.collection]?.fields())

async function onCancelClicked() {
    const confirmed = await modal.confirm({title:'Confirm', body:'Are you sure you want to leave this page?'})
    if(!confirmed) return
    goToList()
}
async function onSaveClicked(data) {
    try {
        const response = await store.collections.createOne(props.collection, data)
        toaster.toast({title:'Success', body:'Data was saved successfully'}, 'top right')
        goToList()
    } catch (error) {
        console.error(error)
        toaster.toast({title:'Error', body: error}, 'top right')
    }
}

const router = useRouter()
function goToList() {
    router.push({name: 'listItems', params: { collection: props.collection }})
}


</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>