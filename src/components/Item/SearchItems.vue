<template>
    <div class="d-flex align-items-center gap-2">
        <div>
            <input
                class="form-control form-control-sm"
                type="search"
                placeholder="search..."
                v-bind="{ ...$attrs }"
                v-model="query"
                @search="onSearch"
            />
        </div>
        <button
            class="btn btn-sm btn-outline-secondary"
            @click="onSearchClicked"
        >
            <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                fixed-width
            />
            <span>search</span>
        </button>
        <button
            class="btn btn-sm btn-outline-primary"
            @click="searchStore.prev"
        >
            <span>prev</span>
        </button>
        <button
            class="btn btn-sm btn-outline-primary"
            @click="searchStore.next"
        >
            <span>next</span>
        </button>
    </div>
    {{ searchStore.current }}
    {{ searchStore.total_count }}
    {{ searchStore.filter_count }}
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import * as settings from '../../settings'
import { debounce } from '../../utils'
import { useRoute } from 'vue-router'
import { useCollection } from '../../store/search'

const route = useRoute()
const collection = computed(() => route.params?.collection)

const searchStore = ref()

watchEffect(() => {
    searchStore.value = useCollection(collection.value)
})

const debounceQuery = debounce((value) => {}, 300)

const query = ref('')

function search() {
    const useFilter = settings[collection.value]?.useFilter
    if (!useFilter) return
    const filter = useFilter(query.value)
    searchStore.value.search(filter)
}

async function onSearchClicked() {
    search()
}
function onSearch() {
    console.log('search', query.value)
    search()
}
</script>

<style scoped></style>
