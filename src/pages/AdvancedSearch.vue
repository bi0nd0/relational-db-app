<template>
    <div class="d-flex flex-column gap-2 w-50 mx-auto">
        <p>This page shows how to use a store to persist search queries and results</p>
        
        <div>
            <p>Step 1: set the collection you want to search</p>
        </div>
        <div class="d-flex gap-2">
            <div>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="collection"
                />
            </div>
            <button
                class="btn btn-sm btn-outline-secondary"
                @click="onSetStoreClicked"
            >
                <font-awesome-icon
                    icon="fa-solid fa-floppy-disk"
                    fixed-width
                />
                <span>set collection</span>
            </button>
        </div>
        
        <div>
            <p>Step 2: set the search parameters</p>
        </div>

        <div class="d-flex flex-column gap-2">
            <div>
                <label class="form-label" :for="`form-nctn`">nctn</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="form.nctn"
                    :id="`form-nctn`"
                />
            </div>
            <div>
                <label class="form-label" :for="`form-nctr`">nctr</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="form.nctr"
                    :id="`form-nctr`"
                />
            </div>
            <div>
                <label class="form-label" :for="`form-ogtn`">ogtn</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="form.ogtn"
                    :id="`form-ogtn`"
                />
            </div>
            <div>
                <label class="form-label" :for="`form-ogtp`">ogtp</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="form.ogtp"
                    :id="`form-ogtp`"
                />
            </div>
            <div>
                <label class="form-label" :for="`form-type`">type</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="form.type"
                    :id="`form-type`"
                />
            </div>
        </div>
        <button class="btn btn-sm btn-outline-success" @click="onSaveSearchClicked">save search</button>
        <button class="btn btn-sm btn-outline-danger" @click="onResetSearchClicked">reset search</button>

        <div class="d-flex align-items-center gap-2" v-if="searchStore">
            <button class="btn btn-sm btn-outline-secondary" @click="onSearchClicked" >
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width />
                <span>search</span>
            </button>
            <button class="btn btn-sm btn-outline-warning" @click="searchStore.reset" >
                <span>reset</span>
            </button>
            <button class="btn btn-sm btn-outline-primary" @click="searchStore.first" :disabled="searchStore.isFirst">
                <span>first</span>
            </button>
            <button class="btn btn-sm btn-outline-primary" @click="searchStore.prev" :disabled="searchStore.isFirst">
                <span>prev</span>
            </button>
            <button class="btn btn-sm btn-outline-primary" @click="searchStore.next" :disabled="searchStore.isLast">
                <span>next</span>
            </button>
            <button class="btn btn-sm btn-outline-primary" @click="searchStore.last" :disabled="searchStore.isLast">
                <span>last</span>
            </button>
        </div>

    </div>
    <div v-if="searchStore">
        <span class="d-block">limit: {{ searchStore.limit }} | page: {{ searchStore.page }}</span>
        <span class="d-block">index: {{ searchStore.index }} | overall index: {{ searchStore.overallIndex }}</span>
        <span class="d-block">first page: {{ searchStore.firstPage }} | last page: {{ searchStore.lastPage }}</span>
        <span>filter count: {{ searchStore.filter_count }} | total count: {{ searchStore.total_count }}</span>
        <div><pre>{{ searchStore.current }}</pre></div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from '../utils'
import { useSearch } from '../store/search'
import { useStorage } from '../utils/useStorage'

const collection = ref('opera')

const searchStore = ref()

function onSetStoreClicked() {
    searchStore.value = useSearch(collection.value)
}

const debounceQuery = debounce((value) => {}, 300)

const storageManager = useStorage('advanced-search-form')

// create the default values for the form
const makeEmptyForm = () => ({
    nctr: '',
    nctn: '',
    ogtn: '',
    ogtp: '',
    type: '',
})
const form = ref(storageManager.get() ?? makeEmptyForm())

// delete data from storage and reset form data
function onSaveSearchClicked() {
    storageManager.set(form.value)
}
// delete data from storage and reset form data
function onResetSearchClicked() {
    storageManager.remove()
    form.value = makeEmptyForm()
}

function search() {
    const _form = form.value
    const rules = []
    for (const [key, value] of Object.entries(_form)) {
        if(!value) continue
        const rule = {
            [key] : {
                _contains: value,
            }
        }
        rules.push(rule)
    }
    const filter = {_and:rules}

    searchStore.value.search(filter, 2)
}

async function onSearchClicked() {
    storageManager.set(form.value)
    search()
}
</script>

<style scoped></style>
