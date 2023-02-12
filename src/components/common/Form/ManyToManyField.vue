<template>

    <div>
        <div class="items d-flex flex-column gap-2 mb-2">
            <template v-for="(item, index) in items" :key="index">
                <div class="item d-flex p-2">
                    <div class="preview">
                        <!-- run the preview function if available -->
                        <template v-if="typeof preview == 'function'">
                            {{ preview(item) }}
                        </template>
                        <!-- show the id otherwise -->
                        <template v-else>
                            <span>{{ item.id }}</span>
                        </template>
                    </div>
                    <button class="btn btn-sm btn-danger ms-auto" @click="onRemoveClicked(item)">
                        <font-awesome-icon icon="fa-solid fa-trash" fixed-width/>
                    </button>
                </div>
                <slot :item="item"></slot>
            </template>
        </div>

        <div class="buttons d-flex gap-2">
            <button class="btn btn-sm btn-primary" @click="onCreateNewClicked">
                <font-awesome-icon icon="fa-solid fa-plus" fixed-width/>
                <span class="ms-1">Create New</span>
            </button>
            <button class="btn btn-sm btn-primary" @click="onAddExistingClicked">
                <font-awesome-icon icon="fa-solid fa-plus" fixed-width/>
                <span class="ms-1">Add Existing</span>
            </button>
        </div>
    </div>

    <Drawer ref="create-drawer">
        <template v-slot:header>
            <span>Create item</span>
        </template>
    </Drawer>

    <Drawer ref="select-drawer">
        <template v-slot:header>
            <span>Select item</span>
        </template>
    </Drawer>

</template>

<script>
import itemsAPI from '../../../API/items'

export default {
    data() {
        return {
            items: []
        }
    },
    created() {
        this.init()
    },
    emits: [ 'update:modelValue' ], // v-model
    props: {
        modelValue: { type: Array, default: () => ([]) }, // v-model
        relation: { type: String, default: '' },
        foreign_key: { type: String, default: null },
        preview: { type: Function, },
    },
    computed: {
        ids: {
            get() {
                const ids = this.modelValue.map(this.extractID)
                return ids
            },
            set(value) {
                // console.log('updating relation', value)
                this.$emit('update:modelValue', value)
            }
        }
    },
    methods: {
        /**
         * watch once, just the time to collect information
         * when created
         */
        init() {
            const unwatch = this.$watch('modelValue', async (value) => {
                await this.fetchData()
                unwatch()
            })
        },
        /**
         * parse a directus relation reference and extratc the id.
         * An relation could be displayed as a number or an object;
         * the object contains an ID when updating and no ID when creating.
         * 
         * @see https://docs.directus.io/reference/introduction.html#relational-data
         * 
         * @param {Number|Object} item 
         * @return Number
         */
        extractID(item) {
            const foreign_key = this.foreign_key
            console.log(this.foreign_key)
            if(typeof item === 'number') return item
            return item?.[foreign_key]
        },
        async fetchData() {
            if(this?.ids?.length==0) return
            // make a request filtering by id
            const params = {
                'filter[id][_in]': this.ids.join(','),
            }
            const response = await itemsAPI.get(this.relation, params)
            this.items = response?.data?.data
        },
        /**
         * remove the item from both
         * the ids (triggering the v-model update)
         * and from the items
         * @param {Object} itemToRemove 
         */
        onRemoveClicked(itemToRemove) {
            const ids = [...this.ids]
            const index = this.items.indexOf(itemToRemove)
            if(index<0) return
            this.items.splice(index, 1)
            ids.splice(index, 1)
            this.ids = [...ids]
        },
        onCreateNewClicked() {
            this.$refs?.['create-drawer']?.show()
        },
        onAddExistingClicked() {
            this.$refs?.['select-drawer']?.show()
        },
    },    
}
</script>

<style scoped>
.item {
    border: solid 1px rgb(0 0 0 / 0.15);
}
</style>