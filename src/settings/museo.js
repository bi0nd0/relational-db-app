import {FormField} from '../models'

export default {
    collection: 'museo',
    fields() {
        return [
            new FormField({ name: 'nome', label: 'Nome', type: 'text', value: '' }),
        ]
    }
}