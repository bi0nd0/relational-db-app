<script>
import { ref, computed } from 'vue'
import store from '../store'

export default {
  setup(props, context) {
    const accessToken = store?.tokenInfo?.access_token
    const authenticated = computed( ()=> store.authenticated )
    const user = computed( ()=> store.user )
    
    return {
      authenticated,user
    }
  }
}
</script>

<template>
 <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <ul class="nav">
      <li class="nav-item"><router-link  :to="{name:'home'}" v-slot="{isExactActive, href}" custom>
        <a class="nav-link" :href="href" :class="isExactActive ? 'active' : ''">Home</a>
      </router-link></li>
      <li class="nav-item"><router-link class="nav-link" :to="{name:'opere'}">Opere</router-link></li>
      <li class="nav-item"><router-link class="nav-link" :to="{name:'autori'}">Autori</router-link></li>
      <li class="nav-item"><router-link class="nav-link" :to="{name:'notes'}">Notes</router-link></li>
    </ul>

    <ul class="nav">
      <template v-if="authenticated">
        <li class="nav-item navbar-text">
          <span>
            <font-awesome-icon icon="fa-solid fa-user" fixed-width/>
            <span>{{user.first_name}}</span>
          </span>
        </li>
        <li class="nav-item"><router-link class="nav-link" :to="{name:'logout'}">
          <font-awesome-icon icon="fa-regular fa-circle-xmark" fixed-width/>
          <span>Logout</span>
        </router-link></li>
      </template>
      <template v-else>
        <li class="nav-item"><router-link class="nav-link" :to="{name:'login'}">
          <font-awesome-icon icon="fa-solid fa-right-to-bracket" fixed-width/>
          <span>Login</span>
        </router-link></li>
      </template>
    </ul>
  </div>
</nav>
</template>

<style scoped>
.active {
  font-weight: bold;
}
</style>
