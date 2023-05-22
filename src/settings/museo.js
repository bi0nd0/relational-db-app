import {FormField, OneToManyField} from '../models'
import { opera } from '.'

export default {
    collection: 'museo',
    fields() {
        return [
            new FormField({ name: 'nome', label: 'Nome', type: 'text', value: '' }),
            new OneToManyField({
                name: 'opere',
                label: 'Opere', value: [],
                related: 'opera',
                foreign_key: 'id',
                preview: (item) => { return `${item?.id ?? '--'} - ${item?.ogtn} ${item?.ogtp}` },
                fields: opera.fields,
                filter: (text) => {
                    if(text.trim()==='') return {}
                    return {
                        _or: [
                            { nctr: { _contains: text } },
                            { nctn: { _contains: text } },
                            { ogtn: { _contains: text } },
                            { ogtp: { _contains: text } },
                        ]
                    }
                },
            }),
        ]
    },
    tableFields() {
        return [
            {key:'id',label:'ID',sortable:false},
            {key:'nome',label:'Nome',sortable: true},
            {key:'opere',label:'Opere',sortable: true},
            {key:'actions',label:'Actions',sortable: false},
        ]
    }
}