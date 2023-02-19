<template>
    <h1>new</h1>

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

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {directus} from '../../API'
import Form from '../common/Form/Form.vue'
import * as settings from '../../settings/'


export default {
    components: { Form },
    props: {
        collection: { type: String, default: '' }
    },
    setup(props, context) {
        const route = useRoute()
        const router = useRouter()
        // infer the collection from the route
        const collection = route.params.collection
        // retrieve the settings
        const itemSettings = settings[collection]
        // define the subset of fields you need to view in the table
        const fields = ref(itemSettings.fields())

        function onCancelClicked() {
            const confirmed = confirm('Are you sure you want to leave this page?')
            if(!confirmed) return
            goToList()
        }
        function onSaveClicked(form) {
            save(form)
        }
        function goToList() {
            router.push({name: 'listItems', params: { collection }})
        }
        async function save(data) {
            try {
                const response = await directus.items(collection).createOne(data)
                alert('saved successfully')
                this.goToList()
            } catch (error) {
                console.error(error)
                alert(error)
            }
        }
        return {
            fields,
            onCancelClicked,onSaveClicked,
        }
    },
    
}
</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>