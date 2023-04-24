import {reactive} from 'vue'


const store = reactive({
    collections: new Map(),
    setCollection(collection, list) {
        this.collections.set(collection, list)
    },
    getCollection(collection) {
        if(!(this.collections.has(collection))) return
        const list = this.collections.get(collection)
        return list
    },
    /* fetchData: async(collection) => {
        const response = await directus.items(collection).readByQuery({limit: -1})
        const {data=[]} = response
        this.setCollection(collection, data)
        return data
    } */
})



export { store as default }