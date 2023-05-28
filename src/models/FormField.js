
/**
 * provide a structure for fields used in a form
 */
export default class {
    name = ''
    label = ''
    type = 'text'
    __initialValue = null // save initial value
    __value = null// value that can be updated
    __dirty = false // mark the field as dirty if modified

    __ready = false

    constructor(params) {
        if(params?.name) this.name = params.name
        if(params?.label) this.label = params.label
        if(params?.type) this.type = params.type
        if(params?.value) this.__initialValue = this.__value = params.value
    }
    
    async setInitialValue(value) { this.__initialValue = this.__value = value }

    get initialValue() { return this.__initialValue }

    get value() { return this.__value }
    set value(value) {
        value = this.beforeSetValue(value)
        this.__dirty = true
        this.__value = value
    }

    setValue(value, dirty=true) {
        this.__value = value
        this.__dirty = dirty
    }

    // visitor applied to the value is set
    beforeSetValue(value) { return value }

    get dirty() { return this.__dirty }

    /**
     * 
     * @returns the value as it is expected from the api
     */
    serialize() { return this.value }

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

/**
 * assign initial data to a set of fields.
 * setInitialValue will load data remotely
 * if the object is designed to do so
 * 
 * @param {Array} fields 
 * @param {Object} data 
 * @returns {Array}
 */
export const useData = async (fields, data={}) => {
    for (const field of fields) {
        const value = data?.[field.name]
        await field.setInitialValue(value)
    }
    return fields
}
/**
 * assign initial data to a set of fields.
 * the data is set as is
 * 
 * @param {Array} fields 
 * @param {Object} data 
 * @returns {Array}
 */
export const setData = async (fields, data={}) => {
    for (const field of fields) {
        const value = data?.[field.name]
        field.setValue(value, false)
    }
    return fields
}