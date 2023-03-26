import FormField from '../models/FormField'
import SelectField from '../models/SelectField'
import autore from './autore'

export default {
    collection: 'opera',
    fields() {
        return [
            // new FormField({ name: 'id', label: 'id', type: 'text' }),
            new FormField({ name: 'tsk', label: 'tsk', type: 'text', value: '' }),
            new FormField({ name: 'lir', label: 'lir', type: 'text', value: '' }),
            new FormField({ name: 'nctn', label: 'nctn', type: 'text', value: '' }),
            new FormField({ name: 'nctr', label: 'nctr', type: 'text', value: '' }),
            new FormField({ name: 'ogtn', label: 'ogtn', type: 'text', value: '' }),
            new FormField({ name: 'ogtp', label: 'ogtp', type: 'text', value: '' }),
            new FormField({
                name: 'autore',
                label: 'autore', type: 'manyToMany', value: [],
                relation: 'autore',
                foreign_key: 'autore_id',
                preview: (item) => { return `${item?.id ?? '--'} - ${item?.autn}` },
                fields: autore.fields,
                filter: (text) => {
                    if(text.trim()==='') return {}
                    return { autn: { _contains: text } }
                },
            }),
            new SelectField({ name: 'type', label: 'type', type: 'select', value: '', options: [
                { value: 'dipinto', label: 'Dipinto'},
                { value: 'statua', label: 'Statua'},
            ] }),
            new FormField({ name: 'visible', label: 'visibile', type: 'checkbox', value: true }),
            // new FormField({ name: 'lc', label: 'lc', type: 'text', defaultValue: null }),
            // new FormField({ name: 'date_created', label: 'date_created', type: 'text' }),
            // new FormField({ name: 'date_updated', label: 'date_updated', type: 'text' }),
            // new FormField({ name: 'user_created', label: 'user_created', type: 'text' }),
            // new FormField({ name: 'user_updated', label: 'user_updated', type: 'text' }),
        ]
    },
    tableFields() {
        return [
            {key:'id',label:'ID',sortable:false},
            {key:'tsk',label:'TSK',sortable: true},
            {key:'lir',label:'LIR',sortable: true},
            {key:'nctr',label:'NCTR',sortable: true},
            {key:'nctn',label:'NCTN',sortable: true},
            {key:'ogtn',label:'OGTN',sortable: true},
            {key:'ogtp',label:'OGTP',sortable: true},
            {key:'type',label:'Tipo',sortable: true},
            {key:'lc',label:'Localizzazione',sortable: false},
            {key:'autore',label:'Autore',sortable: false},
            // {key:'ambito',label:'Ambito',sortable: false},
            {key:'visible',label:'Visibile',sortable: false},
            {key:'actions',label:'Actions',sortable: false},
        ]
    }
}