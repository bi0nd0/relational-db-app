<template>
<div class="d-flex flex-column">
    <span class="d-block">{{file.title}}</span>
    <span class="d-block text-muted small">Size: {{formatBytes(file.filesize)}}</span>
    <span class="d-block text-muted small">Uploaded: {{file.uploaded_on}}</span>
</div>

</template>

<script setup>
import { formatBytes } from '../../../utils';
const props = defineProps({
    file: { type: Object, default: null }
})
</script>

<style lang="scss" scoped>

</style>