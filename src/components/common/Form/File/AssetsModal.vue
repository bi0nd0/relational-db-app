<template>
    <div>
        <button class="btn btn-sm btn-primary" @click="onSelectClicked">
            <font-awesome-icon icon="fa-solid fa-list" fixed-width/>
            <span class="ms-1"><slot name="button-text">Select</slot></span>
        </button>
    </div>
    <b-modal ref="myModal" title="Select a file" ok-only size="lg">
        <div class="d-flex flex-column gap-2">
            <b-pagination v-model="page" :perPage="limit" :totalItems="metadata?.filter_count"/>
            
            <div class="border rounded p-2">
                <template v-for="(file, index) in files" :key="file?.id">
                    <div class="form-check">
                        <input class="form-check-input"  :id="`file-${file.id}`" type="checkbox" v-model="selected" :value="file">
                        <label class="form-check-label" :for="`file-${file.id}`">
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

            <b-pagination v-model="page" :perPage="limit" :totalItems="metadata?.filter_count"/>
        </div>
    </b-modal>
</template>

<script setup>
import { toRaw, ref, watch } from 'vue';
import { directus } from '@/API'
import { useAsset } from '../../../../utils';
import { accessToken, baseURL } from '../../../../API';
import FileMetadata from '../../Upload/FileMetadata.vue';

const {isImage, url, thumbnail} = useAsset(baseURL,accessToken)


const emit = defineEmits(['filesSelected'])
const page = ref(1)
const limit = ref(25)
const metadata = ref({})
const files = ref([])
const myModal = ref()
const selected = ref([])
const width = 80
const height = 80
const imageOptions = {width, height, fit:'contain', quality:80 }

watch(page, async (_page) => {
    const response = await getData(_page)
    metadata.value = response.meta
    files.value = response.data

}, {immediate: true})

async function onSelectClicked() {
    const result = await myModal.value.show()
    if(!result) return // ok was not clicked; exit
    const _files = selected.value.map(_file => toRaw(_file))
    emit('filesSelected', _files)
}

/* async function getMetadata() {
    const response = await directus.items('directus_files').readByQuery({aggregate:{count:'*'}})
    const metadata = response?.data?.[0]
    return metadata
} */
async function getData(_page) {
    const response = await directus.items('directus_files').readByQuery({
        limit: limit.value,
        page: _page,
        meta:'*'
    })
    return response
}

</script>

<style scoped>

</style>