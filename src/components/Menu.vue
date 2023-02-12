<script >

</script>

<template>
<ul>
  <li><router-link :to="{name:'home'}">Home</router-link></li>
  <li><router-link :to="{name:'opere'}">Opere</router-link></li>
  <li><router-link :to="{name:'autori'}">Autori</router-link></li>
  <li><router-link :to="{name:'notes'}">Notes</router-link></li>
</ul>
</template>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 10px;
}
</style>
