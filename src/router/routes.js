import MainLayout from '../layouts/MainLayout.vue'
import Home from '../pages/Home.vue'
import Notes from '../pages/Notes.vue'

// opere
import Opere from '../pages/Opere.vue'
import ListOpere from '../components/Opera/ListOpere.vue'
import CreateOpera from '../components/Opera/CreateOpera.vue'
import EditOpera from '../components/Opera/EditOpera.vue'

// autori
import Autori from '../pages/Autori.vue'
import ListAutori from '../components/Autore/ListAutori.vue'
import CreateAutore from '../components/Autore/CreateAutore.vue'
import EditAutore from '../components/Autore/EditAutore.vue'


const routes = [
    { path: '/', component: MainLayout, children: [
        { path: '',  name: 'home', component: Home },
        { path: '/notes',  name: 'notes', component: Notes },
        { path: '/opere', component: Opere, children: [
            { path: '', name: 'opere', component: ListOpere },
            { path: 'create', name: 'createOpera', component: CreateOpera },
            { path: 'edit/:id', name: 'editOpera', component: EditOpera, props: true, },
        ] },
        { path: '/autori', component: Autori, children: [
            { path: '', name: 'autori', component: ListAutori },
            { path: 'create', name: 'createAutore', component: CreateAutore },
            { path: 'edit/:id', name: 'editAutore', component: EditAutore, props: true, },
        ] },
        /* { path: '/test/:username',  name: 'test', component: Test },
        { path: '/opera/:id',  name: 'opera', component: Opera },
        { path: '/opere',  name: 'opere', components: {
            default: Opere,
            drawer: Drawer,
        }}, */
    ] }
]

export default routes