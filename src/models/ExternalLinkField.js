import { FormField } from "."
/**
 * provide a structure for a external link field
 * in directus choose input field with type string
 */
export default class extends FormField {
    type = 'external-link'

    constructor(params) {
        super(params)
    }

}