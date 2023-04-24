<template>
    <main>
        <div class="card mt-5">
            <div class="card-body">
                <h5 class="card-title">Login</h5>
                <form>

                    <div>
                        <label for="email" class="form-label">Email</label>
                        <input class="form-control" id="email" type="text" v-model="email" autocomplete="username"/>
                    </div>
                    <div>
                        <label for="password" class="form-label">Password</label>
                        <input class="form-control" id="password" type="password" v-model="password" autocomplete="current-password"/>
                    </div>
                    <div class="d-flex mt-2 justify-content-start align-items-center">
                        <button class="btn btn-primary" type="button" @click="login">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import store from '../store'
const userStore = store.user


const router = useRouter()
const route = useRoute()


const email = ref('')
const password = ref('')

async function login() {
    const logged = await userStore.login(email.value, password.value)
    if(!logged) {
        alert('invalid credentials')
        return
    }
    const {redirect} = route.query
    if(redirect) router.push(redirect)
    else router.push({name:'home'})
}

</script>

<style scoped>
main {
    max-width: 400px;
    margin: 0 auto;
}
</style>