import userStore from './user'
import collectionsStore from './collections'


const store = {
    user: userStore,
    collections: collectionsStore,
}



export { store as default }