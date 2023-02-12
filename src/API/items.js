import apiClient from './index'

const defaultSearchParams = {
    fields: '*.*', // Get all top-level fields and all second-level relational fields
}

export default {
    /**
     * List all items that exist in a Directus collection.
     * Get all top-level fields and all second-level relational fields (*.*)
     * @see https://docs.directus.io/reference/query.html#fields
     * @param {String} collection
     * @returns {Array} 
     */
    get(collection, params={}) {
        // params = {...defaultSearchParams, ...params}
        const config = {
            url: `items/${collection}`,
            method: 'GET',
            params,
        }
        return apiClient.request(config)
    },
    /**
     * get an item with a specific ID.
     * Get all top-level fields and all second-level relational fields (*.*)
     * @see https://docs.directus.io/reference/query.html#fields
     * @param {String} collection
     * @returns {Array} 
     */
    getById(collection, id, params={}) {
        params = {...defaultSearchParams, ...params}
        const config = {
            url: `items/${collection}/${id}`,
            method: 'GET',
            params,
        }
        return apiClient.request(config)
    },
    delete(collection, id, params={}) {
        const config = {
            url: `items/${collection}/${id}`,
            method: 'DELETE',
        }
        return apiClient.request(config)
    },
    update(collection, id, data={}, params={}) {
        const config = {
            url: `items/${collection}/${id}`,
            method: 'PATCH',
            data,
        }
        return apiClient.request(config)
    },
    create(collection, data={}, params={}) {
        const config = {
            url: `items/${collection}`,
            method: 'POST',
            data,
        }
        return apiClient.request(config)
    },
}