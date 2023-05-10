<template>
    <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
    <input :type="field.type" :id="`field-${field.name}`" class="form-control" v-model="data">
</template>

<script setup>
import { toRefs, computed } from 'vue';

const props = defineProps({
    modelValue: {},
    field: {}
})
const emit = defineEmits(['update:modelValue'])

const {modelValue, field} = toRefs(props)

const data = computed({
    get() { return modelValue.value },
    set(value) {
        emit('update:modelValue', value)
    }
})

</script>

<style scoped>

</style>