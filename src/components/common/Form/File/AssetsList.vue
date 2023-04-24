<template>
    <template v-for="(asset, index) of ModelValue" :key="idnex">
        <template v-if="asset?.id">
            <div class="d-flex flex-row align-items-end">
                <div class="me-2">
                    <slot :asset="asset"></slot>
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

const {field, modelValue} = toRefs(props)

function deleteAsset() {
    emit('update:modelValue', null)
}

function onDeleteFileClicked(_file) {
    const confirmed = confirm('Are you shure you want to delete this item?')
    if(!confirmed) return
    deleteAsset()
}




</script>

<style scoped>

</style>