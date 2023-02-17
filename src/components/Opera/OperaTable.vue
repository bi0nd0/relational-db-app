<template>
    <Table :items="items" :fields="fields">
        <template #cell(actions)="{item, field, value}" >
            <div class="actions">
                <button title="edit" class="btn btn-sm btn-light" @click="onEditClicked(item)">
                    <font-awesome-icon icon="fa-solid fa-pencil" fixed-width/>
                </button>
                <button title="delete" class="btn btn-sm btn-light text-danger" @click="onDeleteClicked(item)">
                    <font-awesome-icon icon="fa-solid fa-trash" fixed-width/>
                </button>
            </div>
        </template>
        <template #cell(autore)="{item, field, value}" >
            {{ value.map(v => v.autore_id) }}
        </template>
    </Table>
</template>

<script>
import {directus} from '../../API/'
import Table from '../common/Table/Table.vue'
import {opera} from '../../settings/'

// define the collection
const collection = opera.collection
// define the subset of fields you need to view in the table
const fields = opera.tableFields()

export default {
    components: {Table},
    data() {
        return {
            _items: [],
            _fields: fields,
        }
    },
    computed: {
        items() {
            return this._items
        },
        fields() {
            return this._fields
        },
    },
    created() {
        this.fetch()
    },
    methods: {
        async fetch() {
            const response = await directus.items(collection).readByQuery({fields:'*.*',limit: -1})
            const {data=[]} = response
            this._items = data
        },
        async delete(item) {
            const {id} = item
            await directus.items(collection).deleteOne(id)
            this.fetch()
        },
        onEditClicked(item) {
            this.$router.push({name: 'editOpera', params: { id: item.id }})
        },
        onDeleteClicked(item) {
            const confirmed = confirm('Are you sure you want to delete this item?')
            if(confirmed) this.delete(item)
        }
    }
}
</script>

<style scoped>
.actions {
    display: flex;
    gap: 5px;
}
</style>