import {reactive} from 'vue'
import { directus } from '../API'

const store = reactive({
    async fetchAll(collection, page=1, limit=-1) {
        try {
            const response = await directus.items(collection).readByQuery({
                limit,
                page,
                meta:'*',
            })
            return response
        } catch (error) {
            console.log(`there was an error fetching ${collection}`, error)
        }finally {
            this.loading = false
        }
    },
    async fetchOne(collection, id) {
        try {
            const response = await directus.items(collection).readOne(id, {
                fields: '*.*',
            })
            return response
        } catch (error) {
            console.log(`there was an error fetching ${collection}`, error)
        }
    },
    async deleteOne(collection, id) {
        return await directus.items(collection).deleteOne(id)
    },
    async updateOne(collection, id, data) {
        try {
            return await directus.items(collection).updateOne(id, data)
        } catch (error) {
            console.log(`there was an error fetching ${collection}`, error)
        }
    },
    async createOne(collection, data) {
        try {
            return await directus.items(collection).createOne(data)
        } catch (error) {
            console.error(error)
        }
    },
    async getIDs(collection) {
        try {
            const response = await directus.items(collection).readByQuery({
                fields: ['id'],
                limit: -1,
                meta: '*'
            })
            return response
        } catch (error) {
            console.log(`there was an error fetching ${collection}`, error)
        }
    }
})



export { store as default }