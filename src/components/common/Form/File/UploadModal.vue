<template>
    <div>
        <button class="btn btn-sm btn-primary" @click="onUploadClicked">
            <font-awesome-icon icon="fa-solid fa-upload" fixed-width/>
            <span class="ms-1"><slot name="button-text">Upload</slot></span>
        </button>
    </div>
    <b-modal ref="myModal" title="Upload a file" ok-only>
        <div class="upload-wrapper">
            <Upload ref="myUpload"/>
        </div>
    </b-modal>
</template>

<script setup>
import { ref } from 'vue';
import Upload from '../../../common/Upload/Upload.vue'

const emit = defineEmits(['filesSelected'])
const myModal = ref()
const myUpload = ref()

async function onUploadClicked() {
    const result = await myModal.value.show()
    if(!result) return // ok was not clicked; exit
    const files = Array.from(myUpload.value.uploads) // uploads are exposed in Upload.vue
    emit('filesSelected', files)
}
</script>

<style scoped>

</style>