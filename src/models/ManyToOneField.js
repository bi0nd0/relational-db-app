import FormField from "./FormField"
import {directus} from '@/API/'

/**
 * In an M2O relationship, multiple items from the parent collection
 * are linked to one item in a related collection. For example,
 * there are many cities in a country, but a city can only be in one country.
 */
export default class extends FormField {
    type = 'manyToOne'
    // relational data
    related = null// name of related collection
    preview = {} // for relational data
    fields = [] // list of fields of related collection
    filter = () => ({})// for searching

    constructor(params) {
        super(params)
        if(params?.related) this.related = params.related
        if(params?.preview) this.preview = params.preview
        if(params?.fields) this.fields = params.fields
        if(params?.filter) this.filter = params.filter
    }

    async setInitialValue(value) {
        const id = value?.id
        if(!(id)) return null
        // fetch data of related item
        const data = await this.getById(id)
        this.__value = data
    }

    /**
     * fetch a list of items matching specific IDs 
     */
    async getById(id) {
        // make a request filtering by id
        const item = await directus.items(this.related).readOne(id)
        return item
    }

}