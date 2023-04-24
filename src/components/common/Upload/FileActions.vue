<template>
<div class="d-flex gap-2">
    <button class="btn btn-sm btn-outline-secondary" @click="onDownloadClicked" :disabled="!file">
        <font-awesome-icon icon="fa-download" fixed-width/>
    </button>
    <button class="btn btn-sm btn-outline-secondary" @click="onShowClicked" :disabled="!file">
        <font-awesome-icon icon="fa-external-link" fixed-width/>
    </button>
    <button class="btn btn-sm btn-outline-secondary" @click="onDeleteClicked" :disabled="!file">
        <font-awesome-icon icon="fa-trash" fixed-width/>
    </button>
</div>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
    file: { type: Object, default: null }
})

const emit = defineEmits(['downloadFile', 'showFile', 'deleteFile'])
const { file } = toRefs(props)

function onDownloadClicked() {
    emit('downloadFile', file)
}
function onShowClicked() {
    emit('showFile', file)
}
function onDeleteClicked() {
    emit('deleteFile', file)
}
</script>

<style lang="scss" scoped>

</style>