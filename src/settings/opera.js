import autore from './autore'

export default {
    collection: 'opera',
    fields() {
        return [
            // { name: 'id', label: 'id', type: 'text' },
            { name: 'tsk', label: 'tsk', type: 'text', value: '' },
            { name: 'lir', label: 'lir', type: 'text', value: '' },
            { name: 'nctn', label: 'nctn', type: 'text', value: '' },
            { name: 'nctr', label: 'nctr', type: 'text', value: '' },
            { name: 'ogtn', label: 'ogtn', type: 'text', value: '' },
            { name: 'ogtp', label: 'ogtp', type: 'text', value: '' },
            {
                name: 'autore',
                label: 'autore', type: 'manyToMany', value: [],
                relation: 'autore',
                foreign_key: 'autore_id',
                preview: (item) => { return `${item.id} - ${item.autn}` },
                fields: autore.fields(),
            },
            // { name: 'lc', label: 'lc', type: 'text', defaultValue: null },
        
            // { name: 'date_created', label: 'date_created', type: 'text' },
            // { name: 'date_updated', label: 'date_updated', type: 'text' },
            // { name: 'user_created', label: 'user_created', type: 'text' },
            // { name: 'user_updated', label: 'user_updated', type: 'text' },
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
            {key:'lc',label:'Localizzazione',sortable: false},
            {key:'autore',label:'Autore',sortable: false},
            {key:'ambito',label:'Ambito',sortable: false},
            {key:'actions',label:'Actions',sortable: false},
        ]
    }
}