<template>

    <label :for="`file-upload-${id}`" class="custom-file-upload" >
      <font-awesome-icon icon="fa-upload" fixed-width/>
    </label>
    <input ref="fileInput" :id="`file-upload-${id}`" type="file" :multiple="multiple" @change="onFileChanged" />
    
</template>

<script setup>
import { inject, ref } from 'vue';
import { uuidv4 } from '../../../utils';

const props = defineProps({
  disabled: { type: Boolean, default: false}
})

const id = ref(uuidv4())

// get the injected multiple
const multiple = inject('multiple', false);

const emit = defineEmits(['files-selected'])
const fileInput = ref()

function onFileChanged(event) {
  const {files} = fileInput.value
  emit('files-selected', files)
}

</script>

<style scoped>
input[type="file"] {
  display: none;
}

.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #444;
  border-radius: 4px;
}

.custom-file-upload:hover {
  background-color: #f7f7f7;
}

.custom-file-upload i {
  margin-right: 8px;
}
</style>