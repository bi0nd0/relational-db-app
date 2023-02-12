import autm from './autm'

export default {
    collection: 'autore',
    fields() {
        return [
            // { name: 'id', label: 'id', type: 'text' },
            { name: 'autn', label: 'autn', type: 'text', value: '' },
            { name: 'auta', label: 'auta', type: 'text', value: '' },
            {
                name: 'autm',
                label: 'autm', type: 'manyToMany', value: [],
                relation: 'autm',
                foreign_key: 'autm_id',
                preview: (item) => { return `${item.id} - ${item.tipo}` },
                fields: autm.fields()
            },
            // { name: 'date_created', label: 'date_created', type: 'text' },
            // { name: 'date_updated', label: 'date_updated', type: 'text' },
            // { name: 'user_created', label: 'user_created', type: 'text' },
            // { name: 'user_updated', label: 'user_updated', type: 'text' },
        ]
    },
    tableFields() {
        return [
            {key:'id',label:'ID',sortable:false},
            {key:'autn',label:'AUTN',sortable: true},
            {key:'auta',label:'AUTA',sortable: true},
            {key:'autm',label:'AUTM',sortable: true},
            {key:'actions',label:'Actions',sortable: false},
        ]
    }
}