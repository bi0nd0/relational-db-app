<template>
    <slot :fields="fields" :save="save" :loadData="loadData">
        {{ fields }}
    </slot>
</template>

<!--
    this renderless component encapsulates the logic
    for loading and saving data for an item in a
    collection
-->
<script setup>
import { ref, toRefs, inject, watchEffect, toRaw } from 'vue'
import store from '../../store'

const emit = defineEmits(['save', 'error', 'load'])

const props = defineProps({
    collection: { type: String, default: '' },
    fieldsGenerator: { type: Function, default: null },
    id: { type: String, default: null }, // this prop is coming from the router
    data: { type: [Array, Object], default: null }, // this prop is coming from the router
})
const {id, collection} = toRefs(props)

const fields = ref([])

async function loadData() {
    fields.value = []
    const _fields = props.fieldsGenerator() //reset
    const data = await store.collections.fetchOne(props.collection, props.id)
    for (const field of _fields) {
        await field.setInitialValue(data?.[field.name])
    }
    fields.value = _fields
    emit('load', toRaw(fields.value))
}
// trigger loadData whenever there is a change in one of the props
watchEffect(loadData)

async function save(data) {
    try {
        const response = await store.collections.updateOne(collection.value, id.value, data)
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