<template>
    <slot name="label">
        <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
    </slot>
    <div :id="`field-${field.name}`" class="d-flex flex-column gap-2 border p-2 rounded">
        <template v-for="(file, index) in items" :key="file.id">
            <div class="d-flex flex-row align-items-end border rounded p-2">
                <div class="me-2">
                    <template v-if="isImage(file)">
                        <img :src="thumbnail(file, imageOptions)" />
                    </template>
                    <template v-else>
                        <font-awesome-icon icon="fa-solid fa-file" fixed-width :style="{height: `${height}px`, width: `${width}px`}"/>
                    </template>
                </div>
                <div class="d-flex flex-column">
                    <FileMetadata :file="file" />
                    <FileActions :file="file" 
                        @downloadFile="onDownloadClicked"
                        @showFile="onShowAssetClicked"
                        @deleteFile="onDeleteFileClicked"
                    />
                </div>
            </div>
        </template>
        <div class="d-flex gap-2 mt-2">
            <UploadModal @filesSelected="onFilesSelected">
                <template #button-text>Upload files</template>
            </UploadModal>
            <AssetsModal @filesSelected="onFilesSelected" :files="items" multiple>
                <template #button-text>Select existing</template>
            </AssetsModal>
        </div>
    </div>

</template>

<script setup>
import { computed, toRefs, toRaw, provide, inject } from 'vue'
import { Files } from '../../../../models'
import { useAsset } from '../../../../utils'
import { accessToken, baseURL } from '../../../../API'
import UploadModal from './UploadModal.vue'
import AssetsModal from './AssetsModal.vue'
import FileMetadata from '../../Upload/FileMetadata.vue';
import FileActions from '../../Upload/FileActions.vue';

const modal = inject('$modalManager')
provide('multiple', true) // this will be injected in ChooseFilesButton
const {isImage, url, thumbnail} = useAsset(baseURL,accessToken)

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: { type: Object, default: () => ([]) },
    field: { type: Files, default: null },
})

const {field, modelValue:files} = toRefs(props)
const {foreign_key, width , height} = field.value

const imageOptions = computed( () => {
    const { fit, width , height, quality } = field.value
    return { fit, width , height, quality }
} )

const items = computed( () => {
    if(!Array.isArray(files.value)) return []
    return files.value.map(item => toRaw(item?.[foreign_key]))
})

function updateModelValue(_items=[]) {
    const serialized = _items.map( item => ({[foreign_key]:item}) ) 
    emit('update:modelValue', serialized)
}

function deleteAsset(_file) {
    const _items = [...items.value]
    const index = _items.indexOf(_file?.value)
    if(index<0) return
    _items.splice(index, 1)
    updateModelValue(_items)
}

async function onDeleteFileClicked(_file) {
    const confirmed = await modal.confirm({title:'Confirm', body:'Are you shure you want to delete this item?'})
    if(!confirmed) return
    deleteAsset(toRaw(_file))
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

function onFilesSelected(_files) {
    if(!_files || _files?.length===0) return
    const _items = [...items.value]
    for (const _file of _files) {
        _items.push(_file)
    }
    updateModelValue(_items)
}
</script>

<style scoped>

</style>