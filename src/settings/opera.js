import {
    FormField,
    CheckboxField,
    SelectField,
    ManyToManyField,
    ManyToOneField,
    RadioField,
    File,
    Files,
    Image,
    ExternalLinkField,
} from '../models'
import Divider from '../models/Divider'
import { autore, museo } from '.'

export default {
    collection: 'opera',
    fields() {
        return [
            new ExternalLinkField({
                name: 'link',
                label: 'link',
                type: 'text',
                value: '',
            }),
            new FormField({
                name: 'tsk',
                label: 'tsk',
                type: 'text',
                value: '',
            }),
            // new FormField({ name: 'id', label: 'id', type: 'text' }),
            new ManyToManyField({
                name: 'autore',
                label: 'autore',
                value: [],
                related: 'autore',
                foreign_key: 'autore_id',
                preview: (item) => {
                    return `${item?.id ?? '--'} - ${item?.autn}`
                },
                fields: autore.fields,
                filter: (text) => {
                    if (text.trim() === '') return {}
                    return { autn: { _contains: text } }
                },
            }),
            new ManyToOneField({
                name: 'museo',
                label: 'Museo',
                value: null,
                related: 'museo',
                preview: (item) => {
                    return `${item?.id ?? '--'} - ${item?.nome}`
                },
                fields: museo.fields,
                filter: (text) => {
                    if (text.trim() === '') return {}
                    return { nome: { _contains: text } }
                },
            }),
            new File({ name: 'attachment', label: 'Attachment' }),
            new Image({
                name: 'thumbnail',
                label: 'Thumbnail',
                fit: 'contain',
                width: 100,
                height: 100,
                quality: 80,
            }),
            new Files({
                name: 'files',
                label: 'Files',
                foreign_key: 'directus_files_id',
                value: [],
                fit: 'contain',
                width: 100,
                height: 100,
                quality: 80,
            }),

            new FormField({
                name: 'lir',
                label: 'lir',
                type: 'text',
                value: '',
            }),
            new FormField({
                name: 'nctn',
                label: 'nctn',
                type: 'text',
                value: '',
            }),
            new FormField({
                name: 'nctr',
                label: 'nctr',
                type: 'text',
                value: '',
            }),
            new FormField({
                name: 'ogtn',
                label: 'ogtn',
                type: 'text',
                value: '',
            }),
            new FormField({
                name: 'ogtp',
                label: 'ogtp',
                type: 'text',
                value: '',
            }),
            new Divider({ type: 'divider' }),
            new SelectField({
                name: 'type',
                label: 'type',
                value: '',
                options: [
                    { value: 'dipinto', label: 'Dipinto' },
                    { value: 'statua', label: 'Statua' },
                ],
            }),
            new CheckboxField({
                name: 'materials',
                label: 'Materiali',
                value: [],
                inline: false,
                options: [
                    { value: 'pietra', label: 'Pietra' },
                    { value: 'carta', label: 'Carta' },
                    { value: 'acqua', label: 'Acqua' },
                    { value: 'fuoco', label: 'Fuoco' },
                ],
            }),
            new RadioField({
                name: 'color',
                label: 'colore',
                type: 'radio',
                value: '',
                inline: false,
                choices: [
                    { value: 'rosso', label: 'Rosso' },
                    { value: 'blu', label: 'Blu' },
                    { value: 'verde', label: 'Verde' },
                ],
            }),
            new FormField({
                name: 'visible',
                label: 'visibile',
                type: 'toggle',
                value: true,
            }),

            // new FormField({ name: 'lc', label: 'lc', type: 'text', defaultValue: null }),
            // new FormField({ name: 'date_created', label: 'date_created', type: 'text' }),
            // new FormField({ name: 'date_updated', label: 'date_updated', type: 'text' }),
            // new FormField({ name: 'user_created', label: 'user_created', type: 'text' }),
            // new FormField({ name: 'user_updated', label: 'user_updated', type: 'text' }),
        ]
    },
    tableFields() {
        return [
            { key: 'id', label: 'ID', sortable: false },
            { key: 'tsk', label: 'TSK', sortable: true },
            { key: 'lir', label: 'LIR', sortable: true },
            { key: 'nctr', label: 'NCTR', sortable: true },
            { key: 'nctn', label: 'NCTN', sortable: true },
            { key: 'ogtn', label: 'OGTN', sortable: true },
            { key: 'ogtp', label: 'OGTP', sortable: true },
            { key: 'type', label: 'Tipo', sortable: true },
            { key: 'lc', label: 'Localizzazione', sortable: false },
            { key: 'materials', label: 'Materiali', sortable: false },
            { key: 'color', label: 'Colore', sortable: true },
            { key: 'museo', label: 'Museo', sortable: true },
            { key: 'autore', label: 'Autore', sortable: false },
            // {key:'ambito',label:'Ambito',sortable: false},
            { key: 'visible', label: 'Visibile', sortable: false },
            { key: 'actions', label: 'Actions', sortable: false },
        ]
    },
    useFilter: (query) => {
        if (query.trim() === '') return {}
        return {
            nctr: {
                _contains: query,
            },
        }
    },
}
