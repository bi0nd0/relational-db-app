<template>
    <b-dropdown variant="outline-primary" size="sm" v-bind="{...$attrs}">
        <template #button>
            <div class="d-inline">
                <slot :selected="selected">
                    <span>Per page: </span><span class="fw-bold">{{ selected }}</span>
                </slot>
            </div>
        </template>
        <template v-for="(option, index) in options" :key="option">
            <b-dropdown-item @click="selected = option">{{ option }}</b-dropdown-item>
        </template>
    </b-dropdown>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
    options: { type: Array, default: () => [25,50,100] },
    modelValue: { type: Number, default: 50 },
})
const emit = defineEmits(['update:modelValue'])

const {options} = toRefs(props)

const selected = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

</script>

<style scoped>

</style>