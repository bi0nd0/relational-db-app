<template>
    <div class="d-flex">
        <label :for="`field-${field.name}`" v-html="field.label"></label>
        <input class="ms-2" type="checkbox" :id="`field-${field.name}`" value="1" v-model="checked">
    </div>
</template>

<script setup>
import { ref, toRefs, defineProps, defineEmits, computed } from 'vue'
import FormField from '../../../models/FormField'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    field: { type: FormField, default: null },
})

const {field} = toRefs(props)

const checked = computed({
    get() { return field.value.value },
    set(value) {
        emit('update:modelValue', value)
    },
})

</script>

<style scoped>

</style>