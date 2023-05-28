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
        const relations = value ?? []
        const data = await this.fetchData(relations)
        const mapped = data.map( item => ({[this.foreign_key]:item}) )
        super.setInitialValue(mapped)
    }
    
    async fetchData(relations=[]) {
        const foreign_key = this.foreign_key
        if(!foreign_key) throw new Error(`Foreign key not defined`)
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