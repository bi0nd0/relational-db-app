<template>
    <slot :fields="fields" :loadData="loadData">
        {{ fields }}
    </slot>
</template>

<!--
    this renderless component encapsulates the logic
    for loading and saving data for an item in a
    collection
-->
<script setup>
import { ref, watchEffect, toRaw } from 'vue'

const emit = defineEmits(['load'])

const props = defineProps({
    // this is the fucntion that returns the array of fields
    generator: { type: Function, default: null },
    data: { type: [Array, Object], default: null }, // this prop is coming from the router
})

const fields = ref([])

async function loadData() {
    fields.value = []
    const _fields = props.generator() //reset
    if(props.data) {
        // load data if available
        for (const field of _fields) {
            const value = props.data?.[field.name]
            await field.setInitialValue(value)
        }
    }
    fields.value = _fields
    emit('load', toRaw(fields.value))
}
// trigger loadData whenever there is a change in one of the props
watchEffect(loadData)


</script>

<style scoped>
.buttons {
    display: flex;
    gap: 5px;
}
</style>