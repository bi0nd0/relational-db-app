<template>
    <!-- header -->
    <slot name="header" :data="data" :fields="_fields"></slot>

    <div>
        <template v-for="(field, index) in _fields" :key="index">
            <div class="mb-3">
                <label :for="`field-${field.name}`" class="form-label" v-html="field.label"></label>
                <template v-if="field.type=='manyToMany'">
                    <ManyToManyField v-model="data[field.name]"
                        :relation="field.relation" :foreign_key="field.foreign_key" :preview="field.preview"
                    >
                    </ManyToManyField>
                </template>
                <template v-else>
                    <input :type="field.type" :id="`field-${field.name}`" class="form-control" v-model="data[field.name]">
                </template>
            </div>
        </template>
        <!-- extra content in the body -->
        <slot :data="data" :fields="_fields"></slot>
    </div>

    <!-- footer -->
    <slot name="footer" :data="data" :fields="_fields"></slot>

</template>

<script>
import ManyToManyField from './ManyToManyField.vue'
import Field from './Field'

export default {
    components: { ManyToManyField },
    data() {
        return {
            _fields: [], // normalized fields
            data: {}, // form data (will be passed as prop in the slots)
        }
    },
    props: {
        fields: { type: Array, default: [] }
    },
    watch: {
        fields: {
            immediate: true,
            deep: true,
            handler(fields) {
                this._fields = fields.map(field => {
                    if(!(field instanceof Field)) field = new Field(field)
                    // set default datafor each field
                    this.data[field.name] = field.value
                    return field
                })
            }
        }
    }
    
}
</script>

<style scoped>

</style>