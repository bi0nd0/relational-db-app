import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
const accessToken = import.meta.env.VITE_DIRECTUS_STATIC_TOKEN

export default class Client {

    #client
    #baseURL

    constructor() {
        this.#baseURL = baseURL
        console.log(baseURL, accessToken)
        this.#client = this.#makeClient()
    }

    #makeClient() {
        const client = axios.create({
            baseURL: this.#baseURL,
            timeout: 60*1000*3,
            headers: {common: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${accessToken}`
            }},
            paramsSerializer: {
                serialize: (params) =>  {
                    const search_params =  new URLSearchParams(params)
                    return search_params.toString()
                },
            },
        })
        return client
    }

    
    request(config={}, abortController=null) {
        if(abortController instanceof AbortController) config.signal = abortController.signal 
        const client = this.#makeClient()
        return client.request(config)
    }
    
    static makeAbortController() { return new AbortController() }
}