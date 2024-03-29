import { FormField, ManyToManyField } from '../models'
import autm from './autm'

export default {
    collection: 'autore',
    fields() {
        return [
            // new FormField({ name: 'id', label: 'id', type: 'text' }),
            new FormField({ name: 'autn', label: 'autn', type: 'text', value: '' }),
            new FormField({ name: 'auta', label: 'auta', type: 'text', value: '' }),
            new ManyToManyField({
                name: 'autm',
                label: 'autm', value: [],
                related: 'autm',
                foreign_key: 'autm_id',
                preview: (item) => { return `${item?.id ?? '--'} - ${item?.tipo}` },
                fields: autm.fields,
                filter: (text) => {
                    if(text.trim()==='') return {}
                    return { tipo: { _contains: text } }
                },
            }),
            // new FormField({ name: 'date_created', label: 'date_created', type: 'text' }),
            // new FormField({ name: 'date_updated', label: 'date_updated', type: 'text' }),
            // new FormField({ name: 'user_created', label: 'user_created', type: 'text' }),
            // new FormField({ name: 'user_updated', label: 'user_updated', type: 'text' }),
        ]
    },
    tableFields() {
        return [
            {key:'id',label:'ID',sortable:false},
            {key:'autn',label:'AUTN',sortable: true},
            {key:'auta',label:'AUTA',sortable: true},
            {key:'autm',label:'AUTM',sortable: false},
            {key:'actions',label:'Actions',sortable: false},
        ]
    }
}