<template>
    <!-- header -->
    <slot name="header" :data="data" :fields="fields"></slot>

    <div>
        <template v-for="(field, index) in fields" :key="index">
            <div class="mb-3">
                <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
                <slot :name="`field-${field.name}`" :data="data" :fields="fields" :field="field">
                    <template v-if="field.type=='manyToMany'">
                        <ManyToManyField v-model="field.value" :field="field" />
                    </template>
                    <template v-else>
                        <input :type="field.type" :id="`field-${field.name}`" class="form-control" v-model="field.value">
                    </template>
                </slot>
            </div>
        </template>
        <!-- extra content in the body -->
        <slot :data="data" :fields="fields"></slot>
    </div>

    <!-- footer -->
    <slot name="footer" :data="data" :fields="fields"></slot>

</template>

<script>
import { ref, toRefs, watch, computed } from 'vue'
import ManyToManyField from './ManyToManyField.vue'

export default {
    name: 'Form',
    components: { ManyToManyField },
    setup(props, context) {
        const {fields} = toRefs(props)

        const data = computed(() => {
            const onlyDirty = fields.value.filter(field => field.dirty===true)
            const keyValuesList = onlyDirty.map(field => [field.name, field.value])
            return Object.fromEntries(keyValuesList)
        }) // form data (will be passed as prop in the slots)

        return {
            fields, data,
        }
    },
    props: {
        fields: { type: Array, default: [] }
    },
}
</script>

<style scoped>

</style>