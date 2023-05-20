<template>
    <div class="d-flex flex-column">
        <slot name="label">
            <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
        </slot>

        <b-dropdown variant="primary" size="sm" v-bind="{...$attrs}">
            <template #button>
                {{buttonText}}
            </template>
            <template v-for="(option, index) in field.options" :key="index">
                <b-dropdown-item @click="selected = option.value">{{ option.label ?? option.value }}</b-dropdown-item>
            </template>
        </b-dropdown>
    </div>
</template>

<script setup>
import { ref, toRefs, computed } from 'vue'
import SelectField from '../../../models/SelectField'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: { type: [String, Boolean, Number], default: '' },
    field: { type: SelectField, default: null },
})

const {field} = toRefs(props)

const buttonText = computed( () => {
    if(!selected.value) return field.value?.emptyText
    const options = Array.from(field.value?.options)
    const found = options.find(option => option.value === selected.value )
    if(!found) return
    return found.label ?? found.value
} )

const selected = computed({
    get() { return field.value.value },
    set(value) {
        emit('update:modelValue', value)
    },
})

function onChange() {

}

</script>

<style scoped>

</style>