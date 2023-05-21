<template>
    <slot name="label">
        <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
    </slot>
    <div v-if="modelValue?.id">
        <div :id="`field-${field.name}`" class="d-flex flex-row align-items-end">
            <div class="me-2">
                <template v-if="isImage(asset)">
                    <img :src="thumbnail(asset)"/>
                </template>
                <template v-else>
                    <font-awesome-icon icon="fa-solid fa-file" fixed-width :style="{height: `100px`, width: `100px`}"/>
                </template>
            </div>
            <div class="d-flex flex-column">
                <FileMetadata :file="asset" />
                <FileActions :file="asset" 
                    @downloadFile="onDownloadClicked"
                    @showFile="onShowAssetClicked"
                    @deleteFile="onDeleteFileClicked"
                />
            </div>
        </div>
    </div>
    <template v-else>
        <div class="d-flex gap-2 mt-2">
            <UploadModal @filesSelected="onFilesSelected">
                <template #button-text>Upload file</template>
            </UploadModal>
            <AssetsModal @filesSelected="onFilesSelected">
                <template #button-text>Select existing</template>
            </AssetsModal>
        </div>
    </template>
</template>

<script setup>
import { toRefs, provide, inject } from 'vue'
import { File } from '../../../../models'
import { useAsset } from '../../../../utils'
import { accessToken, baseURL } from '../../../../API'
import UploadModal from './UploadModal.vue'
import AssetsModal from './AssetsModal.vue'
import FileMetadata from '../../Upload/FileMetadata.vue';
import FileActions from '../../Upload/FileActions.vue';

const modal = inject('$modalManager')
provide('multiple', false) // this will be injected in ChooseFilesButton
const {isImage, url, thumbnail} = useAsset(baseURL,accessToken)

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
    field: { type: File, default: null },
})

const {field, modelValue:asset} = toRefs(props)

function deleteAsset() {
    emit('update:modelValue', null)
}

async function onDeleteFileClicked(_file) {
    const confirmed = await modal.confirm({title:'Confirm', body:'Are you shure you want to delete this item?'})
    if(!confirmed) return
    deleteAsset()
}

function onShowAssetClicked(_file) {
    let showUrl = url(_file.value, false)
    var win = window.open(showUrl, '_blank')
    win.focus()
}
function onDownloadClicked(_file) {
    let downloadUrl = url(_file.value, true)
    location.href = downloadUrl
}
function onFilesSelected(files) {
    const file = files?.[0]
    if(file) emit('update:modelValue', file)
}

</script>

<style scoped>

</style>