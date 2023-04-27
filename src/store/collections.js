import {reactive} from 'vue'
import { directus } from '../API'

const store = reactive({
    collections: new Map(),
    items: {},
    setCollection(collection, list) {
        this.collections.set(collection, list)
    },
    setItem(collection, id, data) {
        this.items[collection] = this.items[collection] ?? {};
        this.items[collection][id] = this.items[collection][id] ?? {};
        this.items[collection][id] = data
    },
    async getCollection(collection, force=false) {
        if(!(this.collections.has(collection))) {
            return await this.fetchAll(collection)
        }
        const list = this.collections.get(collection)
        return list
    },
    async getItem(collection, id, force=false) {
        let item = this.items?.[collection]?.[id]
        if(force || !item) {
            const response = await  this.fetchOne(collection, id)
            return response
        }
        return item
    },
    async fetchAll(collection) {
        try {
            const response = await directus.items(collection).readByQuery({limit: -1})
            const {data=[]} = response
            this.setCollection(collection, data)
            return data
        } catch (error) {
            console.log(`there was an error fetching ${collection}`, error)
        }
    },
    async fetchOne(collection, id) {
        try {
            const response = await directus.items(collection).readOne(id, {
                fields: '*.*',
            })

            this.setItem(collection, id, response)
            return response
        } catch (error) {
            if(error?.message) alert(error.message)
        }
    }
})



export { store as default }