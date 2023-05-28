import FormField from "./FormField"
import {directus} from '@/API/'

/**
 * In an M2O relationship, multiple items from the parent collection
 * are linked to one item in a related collection. For example,
 * there are many cities in a country, but a city can only be in one country.
 */
export default class extends FormField {
    type = 'manyToMany'
    // relational data
    related = null// name of related collection
    foreign_key = null// id of related collection in many to many table
    preview = {} // for relational data
    fields = [] // list of fields of related collection
    filter = () => ({})// for searching

    constructor(params) {
        super(params)
        if(params?.related) this.related = params.related
        if(params?.foreign_key) this.foreign_key = params.foreign_key
        if(params?.preview) this.preview = params.preview
        if(params?.fields) this.fields = params.fields
        if(params?.filter) this.filter = params.filter
    }

    async setInitialValue(value) {
        const relations = value ?? []
        const data = await this.fetchData(relations)
        const mapped = data.map( item => ({[this.foreign_key]:item}) )
        super.setInitialValue(mapped)
    }
    
    async fetchData(relations=[]) {
        const foreign_key = this.foreign_key
        const ids = []
        for (const relation of relations) {
            if(foreign_key in relation) ids.push(relation[foreign_key])
        }
        if(ids.length==0) return []
        // make a request filtering by id
        const response = await directus.items(this.related).readByQuery({
            filter: {
                id: {
                    _in: ids
                }
            },
            limit: -1
        })
        const {data:_data=[]} = response
        return _data
    }

}