<template>

    <div class="d-flex flex-column gap-2">
        <SearchInput v-model="query" @search="onSearch"></SearchInput>
        <div class="d-flex gap-2 align-items-center">
            <span v-if="metadata.filter_count>0" class="text-muted">
                {{`${from}-${to} of ${metadata.filter_count}`}}
            </span>
            <slot name="header"></slot>
        </div>
        <div>
            <slot :items="items"></slot>
        </div>
        <div class="d-flex align-items-center gap-2">
            <b-pagination v-model="page" :perPage="perPage" :totalItems="metadata.filter_count"/>
            <SelectPageSize v-model="perPage" :options="paginationOptions"/>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import {directus} from '@/API/'
import SearchInput from './SearchInput.vue';
import SelectPageSize from '../SelectPageSize.vue';

const props = defineProps({
    collection: { Type: String, default: '' },
    useQuery: { Type: Function, default: null },
})

const paginationOptions = [10,25,50,100]

const query = ref('')
const page = ref(1)
const perPage = ref(25)
const items = ref([])
const metadata = ref({total_count:0, filter_count:0})

const from = computed( () => {
    let _from = (page.value-1)*perPage.value+1
    return _from
})
const to = computed( () => {
    let _to = (page.value-1)*perPage.value+perPage.value
    if(_to > metadata.value.filter_count) return metadata.value.filter_count
    return _to
})

watch([page, perPage], () => {
    search()
})

async function search() {
    let params = {}
    if(typeof props.useQuery === 'function') params = props.useQuery(query.value)
    params = {
        ...params,
        limit: perPage.value,
        page: page.value,
        meta: '*'
    }
    const response = await directus.items(props.collection).readByQuery(params)
    const {data=[], meta} = response
    items.value = data
    metadata.value = meta
}

function onSearch(value) {
    query.value = value
    search()
}
onMounted( search )

</script>

<style scoped>

</style>