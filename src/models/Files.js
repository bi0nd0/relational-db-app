import Image from "./Image"
import {directus} from '@/API/'

/**
 * single image
 */
export default class extends Image {
    type = 'files'
    foreign_key = null// id of related collection in many to many table
    related='directus_files'


    constructor(params) {
        super(params)
        if(params?.foreign_key) this.foreign_key = params.foreign_key

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

}