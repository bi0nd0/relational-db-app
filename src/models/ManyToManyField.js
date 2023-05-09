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
        const foreign_key = this.foreign_key
        const relations = value ?? []
        if(!foreign_key) throw new Error(`Foreign key not defined`)
        const _ids = []
        for (const relation of relations) {
            if(foreign_key in relation) _ids.push(relation[foreign_key])

        }
        const data = await this.fetchIDs(_ids)
        this.__value = data.map( item => ({[foreign_key]:item}) )
    }
    
    async fetchIDs(ids=[]) {
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


    /**
     * transform to the format expected by the API
     * @returns
     */
    ___serialize() {
        const foreign_key = this.foreign_key
        const serialized = []
        
        // const initialIDs = relations.map(_relation => _relation?.[id])
        for (const item of this.value) {
            const relationID = this.getRelationID(item)
            if(relationID) serialized.push(relationID) // existing relation
            else serialized.push({[foreign_key]:item}) // new item (existing or not)
        }
        return serialized
    }
    
    // check if an element is related to the parent
    getRelationID(element) {
        const relations = this.initialValue ?? []
        const found = relations.find( _relation => _relation.id === element.id )
        return found?.relationID
    }

}