<template>
    <div>
        <button class="btn btn-sm btn-primary" @click="onSelectClicked">
            <font-awesome-icon icon="fa-solid fa-list" fixed-width/>
            <span class="ms-1"><slot name="button-text">Select</slot></span>
        </button>
    </div>
    
    <Drawer ref="myModal">
        <template v-slot:header><span>Select a file</span></template>
        <SelectExisting :collection="'directus_files'" :useQuery="useQuery">
            <template #header>
                <button class="btn btn-sm" @click="changeSize">
                    <font-awesome-icon icon="fa-solid fa-maximize" fixed-width/>
                </button>
            </template>
            <template #default="{ items }">
                <div class="d-flex flex-wrap flex-column gap-2">
                    <template v-for="(file, index) in items" :key="file?.id">
                        <div class="form-check border rounded">
                            <template v-if="multiple">
                                <input class="form-check-input"  :id="`input-file-${index}`" type="checkbox" v-model="selected" :value="file">
                            </template>
                            <template v-else>
                                <input class="form-check-input"  :id="`input-file-${index}`" type="radio" v-model="selected" :value="file">
                            </template>
                            <label class="form-check-label" :for="`input-file-${index}`">
                                <div class="d-flex gap-2 align-items-end">
                                    <template v-if="isImage(file)">
                                        <img :src="thumbnail(file, imageOptions)" />
                                    </template>
                                    <template v-else>
                                        <font-awesome-icon icon="fa-solid fa-file" fixed-width :style="{height: `${height}px`, width: `${width}px`}"/>
                                    </template>
                                    <FileMetadata :file="file" />
                                </div>
                            </label>
                        </div>
                    </template>
                </div>
            </template>
        </SelectExisting>

    </Drawer>
</template>

<script setup>
import { toRaw, ref, computed, toRefs } from 'vue';
import { useAsset } from '../../../../utils';
import { accessToken, baseURL } from '../../../../API';
import FileMetadata from '../../Upload/FileMetadata.vue';

import SelectExisting from '../SelectExisting.vue';

const {isImage, url, thumbnail} = useAsset(baseURL,accessToken)

const props = defineProps({
    multiple: { type: Boolean, default: false },
    filter: { type: [Function, Object], default: () => {} },
    files: { type: Array, default: () => [] },
})

const {multiple} = toRefs(props)

const assetSizes = [90, 136, 176, 244]
const sizeIndex = ref(0)

const emit = defineEmits(['filesSelected'])
const myModal = ref()
const selected = ref([])
const width = computed( () => assetSizes[sizeIndex.value])
const height = computed( () => assetSizes[sizeIndex.value])
const imageOptions = computed( () => ({width: width.value, height: height.value, fit:'contain', quality:80 }) )

const useQuery = (query) => {
    // the text filter for files is defined here, not in the settings or the file component
    const textFilter = (text) => {
        if(text.trim()==='') return {}
        return { title: { _contains: text } }
    }
    // get the field filter
    const fieldFilter = (typeof props.filter === 'function') ? props.filter() : props.filter
    // combine the 2 filters
    const params = {
        filter: {...textFilter(query), ...fieldFilter}
    }
    const existingIDs = []
    for (const file of props.files) {
        if(file?.id) existingIDs.push(file.id)
    }
    if(existingIDs.length>0) {
        params.filter.id = {
            _nin: existingIDs
        }
    }
    return params
}

async function onSelectClicked() {
    try {
        const result = await myModal.value.show()
        if(!result) return // ok was not clicked; exit
        let selection = []
        if(multiple.value===true ) {
            selection = selected.value.map(_file => toRaw(_file))
        }else if(multiple.value===false) {
            selection = [toRaw(selected.value)] // always return an array
        }
        emit('filesSelected', selection)
    } finally {
        selected.value = [] //reset
    }
}

function changeSize() {
    const currentIndex = sizeIndex.value
    if(currentIndex>=assetSizes.length-1) sizeIndex.value = 0
    else sizeIndex.value += 1
}

</script>

<style scoped>
.form-check {
    position: relative;
    padding: 0;
    padding: 1rem 2rem;
}
.form-check input {
    position: absolute;
    top: 10px;
    left: 30px;
}
</style>