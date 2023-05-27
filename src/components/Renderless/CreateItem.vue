<template>
    <slot :fields="fields" :loadFields="loadFields" :save="save">
       
    </slot>
    
</template>

<script setup>
import { ref, toRaw, watchEffect } from 'vue'
import * as settings from '../../settings/'
import store from '../../store'

const props = defineProps({
    collection: { type: String, default: '' },
    fieldsGenerator: { type: Function, default: null },
})
const emit = defineEmits(['load', 'save', 'error'])

const fields = ref([])

function loadFields() {
    fields.value = [] //reset
    const collectionFields = props.fieldsGenerator()
    // define the subset of fields you need to view in the table
    fields.value = collectionFields
    emit('load', toRaw(fields.value))
}

watchEffect(loadFields)

async function save(data) {
    try {
        const response = await store.collections.createOne(collection.value, data)
        emit('save', response)
        return response
    } catch (error) {
        emit('error', error)
    }
}

</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>