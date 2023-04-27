<template>
    <div class="d-flex gap-2">
        <div>
            <button class="btn btn-sm btn-outline-primary" @click="onPrevClicked" :disabled="!prev">
                <font-awesome-icon icon="fa-solid fa-chevron-left" fixed-width/>
                <span class="ms-1">Prev</span>
            </button>
        </div>
        <div class="ms-auto">
            <button class="btn btn-sm btn-outline-primary" @click="onNextClicked" :disabled="!next">
                <font-awesome-icon icon="fa-solid fa-chevron-right" fixed-width/>
                <span class="ms-1">Next</span>
            </button>
        </div>
        <!-- {{prev}} -->
<!-- {{next}} -->
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import store from '../../store'
import { ref, toRefs, computed, watch } from 'vue';
const collectionsStore = store.collections

const props = defineProps({
    collection: { type: String, default: '' },
    id: { type: String, default: null },
})
const {id, collection} = toRefs(props)

const route = useRoute()
const router = useRouter()
const list = ref([])

watch(collection, async() => {

    if(collection.value==null) list.value = []
    list.value = await collectionsStore.getCollection(collection.value)
}, {immediate: true})


function onPrevClicked() {
    const _prev = prev.value
    if(_prev) {
        route.params.id = _prev
        router.push(route)
    }
}
function onNextClicked() {
    const _next = next.value
    if(_next) {
        route.params.id = _next
        router.push(route)
    }
}

const prev = computed( () => {
    const index = list.value.findIndex(item => {
        const _id = parseInt(id.value)
        return item.id==_id
    })
    if(index==0) return false
    return list.value?.[index-1]?.id
} )
const next = computed( () => {
    const index = list.value.findIndex(item => {
        const _id = parseInt(id.value)
        return item.id==_id
    })
    if(index>=list.value.length) return false
    return list.value?.[index+1]?.id
} )


</script>

<style lang="scss" scoped>

</style>