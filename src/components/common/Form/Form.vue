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
                    <template v-else-if="field.type=='divider'">
                        <Divider />
                    </template>
                    <template v-else>
                        <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
                        <input :type="field.type" :id="`field-${field.name}`" class="form-control" v-model="field.value">
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
import { toRefs, computed } from 'vue'
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
    Image,
    Divider,
} from '.'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    fields: { type: Array, default: [] },
    modelValue: { type: [Array,Object], default: [] },
})

const {fields} = toRefs(props)

const data = computed(() => {
    const onlyDirty = fields.value.filter(field => field.dirty===true)
    const keyValuesList = onlyDirty.map(field => [field.name, field.value])
    const _data = Object.fromEntries(keyValuesList)
    emit('update:modelValue', _data)
    return _data
}) // form data (will be passed as prop in the slots)

</script>

<style scoped>

</style>