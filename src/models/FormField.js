
/**
 * provide a structure for fields used in a form
 */
export default class Field {
    name = ''
    label = ''
    type = 'text'
    $initialValue = null // save initial value
    $value = null// value that can be updated
    $dirty = false // mark the field as dirty if modified
    
    // relational data
    relation = null// for relational data
    foreign_key = null// for relational data
    preview = {} // for relational data
    fields = [] // for relational data (list of fields )
    filter = () => ({})// for searching

    constructor(params) {
        if(params?.name) this.name = params.name
        if(params?.label) this.label = params.label
        if(params?.type) this.type = params.type
        this.$initialValue = this.$value = params?.value ?? this.#getDefaultValueByType(this.type)
        // relational data
        if(params?.relation) this.relation = params.relation
        if(params?.foreign_key) this.foreign_key = params.foreign_key
        if(params?.preview) this.preview = params.preview
        if(params?.fields) this.fields = params.fields
        if(params?.filter) this.filter = params.filter
    }

    get value() { return this.$value }
    set value(value) {
        this.$dirty = true
        this.$value = value
    }

    get dirty() { return this.$dirty }

    #getDefaultValueByType(type) {
        let value
        switch (type) {
            case 'text':
                value = ''
                break;
            case 'number':
                value = 0
                break;
            case 'boolean':
                value = false
                break;
            default:
                break;
        }
        return value
    }


}