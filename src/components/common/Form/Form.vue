<template>
    <!-- header -->
    <slot name="header" :data="data" :fields="fields"></slot>

    <div>
        <template v-for="(field, index) in fields" :key="index">
            <div class="mb-3">
                <slot :name="`field-${field.name}`" :data="data" :fields="fields" :field="field">
                    <template v-if="field.type=='manyToMany'">
                        <ManyToMany v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='oneToMany'">
                        <OneToMany v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='manyToOne'">
                        <ManyToOne v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='checkbox'">
                        <Checkbox v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='toggle'">
                        <Toggle v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='radio'">
                        <Radio v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='select'">
                        <SelectDropdown v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='simple-select'">
                        <SelectSimple v-model="field.value" :field="field" />
                    </template>
                    <template v-else-if="field.type=='file'">
                        <File v-model="field.value" :field="field"/>
                    </template>
                    <template v-else-if="field.type=='image'">
                        <Image v-model="field.value" :field="field"/>
                    </template>
                    <template v-else-if="field.type=='files'">
                        <Files v-model="field.value" :field="field"/>
                    </template>
                    <template v-else-if="field.type=='external-link'">
                        <ExternalLinkInput v-model="field.value" :field="field"/>
                    </template>
                    <template v-else-if="field.type=='divider'">
                        <Divider />
                    </template>
                    <template v-else>
                        <StandardInput v-model="field.value" :field="field"/>
                    </template>
                </slot>
            </div>
        </template>
        <!-- extra content in the body -->
        <slot :data="data" :fields="fields"></slot>
    </div>
    <!-- {{ data }} -->
    <!-- footer -->
    <slot name="footer" :data="data" :fields="fields"></slot>

</template>

<script setup>
import { toRefs, computed, watchEffect, watch } from 'vue'
import {
    ManyToMany,
    OneToMany,
    ManyToOne,
    Toggle,
    Checkbox,
    SelectDropdown,
    SelectSimple,
    Radio,
    File,
    Files,
    Image,
    Divider,
    StandardInput,
    ExternalLinkInput,
} from '.'

const props = defineProps({
    fields: { type: Array, default: [] },
    data: { type: Object, default: null },
    // modelValue: { type: [Array,Object], default: [] },
})

const emit = defineEmits(['change'])

const {fields} = toRefs(props)

const data = () => {
    const onlyDirty = fields.value.filter(field => field.dirty===true)
    const keyValuesList = onlyDirty.map(field => [field.name, field.value])
    const _data = Object.fromEntries(keyValuesList)
    return _data
} // form data (will be passed as prop in the slots)

watch( fields, () => {
    emit('change', data())
}, {immediate: true, deep: true})

defineExpose({data})

</script>

<style scoped>

</style>