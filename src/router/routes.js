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
import Login from '../pages/Login.vue'
import Logout from '../pages/Logout.vue'
import * as settings from '../settings'
// items
import Items from '../pages/Items.vue'
import ListItems from '../components/Item/ListItems.vue'
import CreateItem from '../components/Item/CreateItem.vue'
import EditItem from '../components/Item/EditItem.vue'


const routes = [
    { path: '/', component: MainLayout, children: [
        { path: '',  name: 'home', component: Home ,meta: { requiresAuth: true } },
        { path: '/notes',  name: 'notes', component: Notes, meta: { requiresAuth: true }  },
        { path: '/opere', component: Opere, children: [
            { path: '', name: 'opere', component: ListOpere },
            { path: 'create', name: 'createOpera', component: CreateOpera },
            { path: 'edit/:id', name: 'editOpera', component: EditOpera, props: true, },
        ], meta: { requiresAuth: true } },
        { path: '/autori', component: Autori, children: [
            { path: '', name: 'autori', component: ListAutori, meta: { settings: settings.autore} },
            { path: 'create', name: 'createAutore', component: CreateAutore },
            { path: 'edit/:id', name: 'editAutore', component: EditAutore, props: true, },
        ], meta: { requiresAuth: true } },
        { path: '/items', component: Items, children: [
            { path: '', name: 'listItems', component: ListItems },
            { path: ':collection', name: 'listItems', component: ListItems, props: true, },
            { path: ':collection/create', name: 'createItem', component: CreateItem, props: true, },
            { path: ':collection/edit/:id', name: 'editItem', component: EditItem, props: true, },
        ],props: true, meta: { requiresAuth: true } },
        { path: '/login',  name: 'login', component: Login },
        { path: '/logout',  name: 'logout', component: Logout },
        /* { path: '/test/:username',  name: 'test', component: Test },
        { path: '/opera/:id',  name: 'opera', component: Opera },
        { path: '/opere',  name: 'opere', components: {
            default: Opere,
            drawer: Drawer,
        }}, */
    ] }
]

export default routes