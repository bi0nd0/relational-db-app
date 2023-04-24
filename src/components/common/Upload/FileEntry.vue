<template>
<div class="d-flex flex-row gap-2 border border-light border-2 rounded p-2">
    <!-- <a href="#" :download="file.filename_download" @click.prevent="onDownloadClicked"></a> -->
        <template v-if="isImage(file)">
            <img :src="thumbnail(file, imageOptions)" />
        </template>
        <template v-else>
            <font-awesome-icon icon="fa-file" fixed-width :style="{height: `${imageOptions.height}px`, width: `${imageOptions.width}px`}"/>
        </template>
    <div class="d-flex flex-column">
        <FileMetadata :file="file" />
        <FileActions :file="file" 
            @downloadAsset="onDownloadClicked"
            @showAsset="onShowAssetClicked"
            @deleteAsset="onDeleteFileClicked"
        />

    </div>

</div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue';
import { accessToken, baseURL } from '../../../API';
import { useAsset } from '../../../utils';
import FileMetadata from './FileMetadata.vue';
import FileActions from './FileActions.vue';

const {isImage, url, thumbnail} = useAsset(baseURL,accessToken)



const emit = defineEmits(['file-removed'])

const props = defineProps({
    file: { type: Object, default: () => ({}) }
})

const {file} = toRefs(props)

const imageOptions = ref({
    fit: 'contain',
    width: 100,
    height: 100,
    quality: 80,
})

function onDeleteFileClicked() { emit('file-removed', file.value) }
function onShowAssetClicked() {
    let showUrl = url(file.value, false)
    var win = window.open(showUrl, '_blank')
    win.focus()
}
function onDownloadClicked() {
    let downloadUrl = url(file.value, true)
    location.href = downloadUrl
}
</script>

<style scoped>

</style>