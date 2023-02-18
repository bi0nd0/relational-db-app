<template>
    <div class="card">

    </div>
</template>

<script>
import { ref } from 'vue'
import {authentication} from '../API'
import {router} from '../router'

export default {
    setup(props, context) {

        async function logout() {
            const response = await authentication.logout()
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