<template>
    <div>
        <button class="btn btn-sm btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-chevron-left" fixed-width/>
            <span class="ms-1">Prev</span>
        </button>
        <button class="btn btn-sm btn-outline-secondary">
            <font-awesome-icon icon="fa-solid fa-chevron-right" fixed-width/>
            <span class="ms-1">Next</span>
        </button>
        {{id}}, {{collection}}
        {{ list }}
        {{prev}}
{{next}}
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import store from '../../store'
import { toRefs, computed, watch } from 'vue';
const collectionsStore = store.collections

const props = defineProps({
    collection: { type: String, default: '' },
    id: { type: String, default: null },
})
const {id, collection} = toRefs(props)

const route = useRoute()
const router = useRouter()

const list = computed( () => {
    if(collection.value==null) return []
    return collectionsStore.getCollection(collection.value)
})

const prev = computed( () => {

    // const index = list.value.findIndex(item => item.id===id.value)
    // if(index===0) return false
    // return list?.[index-1]?.id
})
const next = computed( () => {
    // const index = list.value.findIndex(item => item.id===id.value)
    // if(index>=list.length) return false
    // return list?.[index+1]?.id
})


</script>

<style lang="scss" scoped>

</style>