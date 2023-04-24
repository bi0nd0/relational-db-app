<template>
    <template v-if="asset?.id">
        <div class="d-flex flex-row align-items-end">
            
            <div class="me-2">
                <img :src="thumbnail(asset, imageOptions)" />
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
    </template>
    <template v-else>
        <UploadModal @filesSelected="onFilesSelected">
            <template #button-text>Upload Image</template>
        </UploadModal>
    </template>
</template>

<script setup>
import { toRefs, computed, provide } from 'vue'
import { Image as ImageModel } from '../../../../models';
import { useAsset } from '../../../../utils';
import { accessToken, baseURL } from '../../../../API';
import UploadModal from './UploadModal.vue';
import FileMetadata from '../../Upload/FileMetadata.vue';
import FileActions from '../../Upload/FileActions.vue';

const {isImage, url, thumbnail} = useAsset(baseURL,accessToken)

provide('multiple', false) // this will be injected in ChooseFilesButton

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
    field: { type: ImageModel, default: null },
})

const {field, modelValue:asset} = toRefs(props)
const imageOptions = computed( () => {
    const { fit, width , height, quality } = field.value
    return { fit, width , height, quality }
} )

function deleteAsset() {
    emit('update:modelValue', null)
}

function onDeleteFileClicked(_file) {
    const confirmed = confirm('Are you shure you want to delete this item?')
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