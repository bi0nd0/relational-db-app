<template>
    <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
    <div class="input-group mb-3">
        <input type="text" :id="`field-${field.name}`" class="form-control" placeholder="https://example.com" v-model="data">
        <button class="btn btn-outline-secondary" type="button" @click="onLinkButtonClicked" :disabled="url===null">
            <font-awesome-icon icon="fa-link" fixed-width />
        </button>
    </div>
</template>

<script setup>
import { toRefs, computed } from 'vue';
import { ExternalLinkField } from '../../../models';

const props = defineProps({
    modelValue: { type: String, default: '' },
    field: { type: ExternalLinkField, default: null },
})
const emit = defineEmits(['update:modelValue'])

const {modelValue, field} = toRefs(props)

const data = computed({
    get() { return modelValue.value },
    set(value) {
        emit('update:modelValue', value)
    }
})

const url = computed( () => {
    try {
       return new URL(modelValue.value)
    } catch (error) {
        return null
    }
})

function onLinkButtonClicked() {
    if(url.value==null) return
    var win = window.open(url.value, '_blank')
    win.focus()
}

</script>

<style scoped>

</style>