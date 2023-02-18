<template>
    <div class="card mt-5 w-50 mx-auto">
        <div class="card-body">
            <h5 class="card-title">Login</h5>
            <div>
                <label for="email" class="form-label">Email</label>
                <input class="form-control" id="email" type="text" v-model="email"/>
            </div>
            <div>
                <label for="password" class="form-label">Password</label>
                <input class="form-control" id="password" type="text" v-model="password"/>
            </div>
            <div class="d-flex mt-2 justify-content-start align-items-center">
                <button class="btn btn-primary" type="button" @click="login">Login</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import {authentication} from '../API'
import { useRouter, useRoute } from 'vue-router'

export default {
    setup(props, context) {

        const router = useRouter()
        const route = useRoute()


        const email = ref('admin@example.com')
        const password = ref('d1r3ctu5')

        async function login() {
            const logged = await authentication.login(email.value, password.value)

            if(!logged) {
                alert('invalid credentials')
                return
            }
            const {redirect} = route.query
            if(redirect) router.push(redirect)
            else router.push({name:'home'})
        }

        return {
            email, password,
            login,
        }
    }
}
</script>

<style scoped>

</style>