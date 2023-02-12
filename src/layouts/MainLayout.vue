<template>
    <section class="layout">
        <div>
            <Menu/>
            <router-view />
        </div>
        <router-view name="drawer"/>
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
    display: grid;
    grid-template-rows: max-content auto;
    grid-template-columns: auto auto;
    padding: 10px;
    max-width: 800px;
}
</style>