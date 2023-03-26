import { FormField } from "."
/**
 * provide a structure for fields used in a form
 */
export default class RadioField extends FormField {
    choices = []

    constructor(params) {
        super(params)
        if(Array.isArray(params?.choices)) this.choices = params.choices
    }

}