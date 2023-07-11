import { reactive } from 'vue'
import { directus } from '../API/'

/**
 * this store implements the logic necessary to
 *  - search items in a collection
 *  - store the results and the metadata
 *  - show the current system
 *  - move across the results
 */

/**
 * create a store for a specific collection
 * @param {string} collection 
 * @returns {Object}
 */
const makeStore = (collection) => {
    return {
        query: '',
        results: [],
        filter_count: 0,
        total_count: 0,
        limit: -1,
        page: 1,
        index: 0, // index of all results
        filter: {},
        get overallIndex() {
            let limit = this.limit>=0 ? this.limit : 0 
            let result = (this.page-1) * limit + this.index
            return result
        },
        async search(filter = {}, limit = -1, page = 1, index=0) {

            const response = await directus.items(collection).readByQuery({
                filter,
                limit,
                page,
                meta: '*',
            })
            const {
                data,
                meta: { filter_count, total_count },
            } = response

            // set all local variables
            this.filter = filter
            this.limit = limit
            this.page = page
            this.results = data
            this.filter_count = filter_count ?? 0
            this.total_count = total_count ?? 0
            this.index = index
        },
        reset() {
            this.results = []
            this.filter_count = 0
            this.total_count = 0
            this.index = 0
            this.filter = {}
            this.limit = -1
            this.page = 1
        },
        get current() {
            return this.results[this.index] ?? null
        },
        async prev() {
            if(!this.hasResults) return
            
            if(this.isFirst) return
            
            let index = this.index
            if(index===0) {
                index = this.limit-1
                await this.search(this.filter, this.limit, this.page-1, index)
                return
            }
            
            this.index--
        },
        async next() {
            if(!this.hasResults) return

            if (this.isLast) return

            let index = this.index
            if(index>=this.limit-1) {
                index=0
                await this.search(this.filter, this.limit, this.page+1, index)
                return
            }

            this.index++
        },
        async first() {
            if(!this.hasResults) return
            if(this.page===this.firstPage) {
                this.index = 0
                return
            }
            await this.search(this.filter, this.limit, this.firstPage, 0)
        },
        async last() {
            if(!this.hasResults) return
            const lastItemIndex = (this.filter_count-1)%this.limit
            if(this.page===this.lastPage) {
                this.index = lastItemIndex
                return
            }
            await this.search(this.filter, this.limit, this.lastPage, lastItemIndex)
        },
        get isFirst() {
            if(!this.hasResults) return true
            return this.overallIndex===0
        },
        get isLast() {
            if(!this.hasResults) return true
            return this.overallIndex===this.filter_count-1
        },
        get hasResults() {
            return this.filter_count>0
        },
        get firstPage() {
            return 1
        },
        get lastPage() {
            if(this.limit<=0) return 1
            return Math.ceil(this.filter_count/this.limit)
        },
    }
}

const store = reactive({})

const useSearch = (collection) => {
    if (!store[collection]) {
        store[collection] = makeStore(collection)
    }
    return store[collection]
}

export { store as default, useSearch }
