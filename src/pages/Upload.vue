<template>
    <div>
        <Modal ref="myModal" title="warning" ok-only>
            <Upload />
        </Modal>
    </div>
</template>

<script setup>
import Upload from '@/components/common/Upload/Upload.vue'
import {Modal} from 'bootstrap5-vue-3'
import { onMounted, ref } from 'vue'

const myModal = ref()
onMounted( () => {
    myModal.value.show()
} )
</script>

<style scoped>


</style>