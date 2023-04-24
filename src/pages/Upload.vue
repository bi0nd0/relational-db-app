<template>
    <div>
        <b-modal ref="myModal" title="Upload a file" ok-only>
            <div class="upload-wrapper">
                <Upload />
            </div>
        </b-modal>
        <button class="btn btn-sm btn-primary" @click="showModal">Upload</button>
    </div>
</template>

<script setup>
import Upload from '@/components/common/Upload/Upload.vue'
import { ref } from 'vue'

const myModal = ref()

function showModal() {
    myModal.value.show()
}
</script>

<style scoped>
.upload-wrapper :deep(.file-list-wrapper) {
    max-height: 400px;
    overflow-y: auto;
}

</style>