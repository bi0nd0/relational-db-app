<template>
    <section class="layout">
        <header>
            <Menu/>
        </header>
        <main>
            <router-view />
        </main>
    </section>
</template>

<script>
import Menu from '../components/Menu.vue'
export default {
    components: { Menu }
}
</script>

<style scoped>
section {
    /* display: grid; */
    grid-template-rows: max-content auto;
    grid-template-columns: auto auto;
}
main {
    padding: 10px;


}
</style>