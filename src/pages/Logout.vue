<template>
    <div class="card">

    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter} from 'vue-router'
import store from '../store'
const userStore = store.user

export default {
    setup(props, context) {
        const router = useRouter()

        async function logout() {
            const response = await userStore.logout()
            router.push({name:'login'})
        }

        logout()

        return {

        }
    }
}
</script>

<style scoped>

</style>