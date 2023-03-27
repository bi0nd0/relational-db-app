import {
    FormField,
    CheckboxField,
    SelectField,
    ManyToManyField,
    RadioField,
} from '../models'
import Divider from '../models/Divider'
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
            new Divider({ type: 'divider' }),
            new ManyToManyField({
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
            new CheckboxField({ name: 'materials', label: 'Materiali', type: 'checkbox', value: [],
                inline: false,
                options: [
                    { value: 'pietra', label: 'Pietra'},
                    { value: 'carta', label: 'Carta'},
                    { value: 'acqua', label: 'Acqua'},
                    { value: 'fuoco', label: 'Fuoco'},
                ]
            }),
            new RadioField({ name: 'color', label: 'colore', type: 'radio', value: '',
                inline: false,
                choices: [
                    { value: 'rosso', label: 'Rosso'},
                    { value: 'blu', label: 'Blu'},
                    { value: 'verde', label: 'Verde'},
                ]
            }),
            new FormField({ name: 'visible', label: 'visibile', type: 'toggle', value: true }),
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
            {key:'materials',label:'Materiali',sortable: false},
            {key:'color',label:'Colore',sortable: true},
            {key:'autore',label:'Autore',sortable: false},
            // {key:'ambito',label:'Ambito',sortable: false},
            {key:'visible',label:'Visibile',sortable: false},
            {key:'actions',label:'Actions',sortable: false},
        ]
    }
}