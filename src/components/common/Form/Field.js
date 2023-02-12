
/**
 * provide a structure for fields used in a form
 */
export default class Field {
    name
    label
    type
    value
    relation // for relational data
    foreign_key // for relational data
    preview // for relational data
    fields // for relational data


    constructor(params) {
        this.name = params?.name ?? ''
        this.label = params?.label ?? ''
        this.type = params?.type ?? 'text'
        this.value = params?.value ?? this.#getDefaultValueByType(this.type)
        // relational data
        this.relation = params?.relation ?? null
        this.foreign_key = params?.foreign_key ?? null
        this.preview = params?.preview ?? (() => ({}))
        this.fields = params?.fields ?? (() => [])
    }

    #getDefaultValueByType(type) {
        let value
        switch (type) {
            case 'test':
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