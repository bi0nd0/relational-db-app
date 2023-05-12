<template>
    <div class="input-group">
        <input class="form-control" type="search" v-model="query" placeholder="3 characters min..."  @keyup.enter="onSearch" @search="onCommit"/>
        <button class="btn btn-sm btn-primary" @click="onSearch">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width/>
            <span class="ms-1">Search</span>
        </button>
    </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { debounce } from '../../../utils';

const debounceQuery = debounce((value) => {
    emit('update:modelValue', value)
}, 300)

const props = defineProps({
    modelValue: { type: String, default: ''}
})
const emit = defineEmits(['update:modelValue','search'])

const {modelValue} = toRefs(props)

const query = computed({
    get() { return modelValue.value },
    set: debounceQuery,
})

function onSearch() { emit('search', query.value) }

// triggered by the clear input in the search field
function onCommit() { emit('search', '') }

</script>

<style scoped>

</style>