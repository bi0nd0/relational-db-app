import FormField from "./FormField"

/**
 * single file
 */
export default class extends FormField {
    type = 'file'

    rootFolder = null// name of related collection
    filter = () => ({})// for searching

    constructor(params) {
        super(params)
        if(params?.rootFolder) this.rootFolder = params.rootFolder
        if(params?.filter) this.filter = params.filter
    }

}