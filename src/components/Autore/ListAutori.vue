<template>
    <header class="mb-2">
        <router-link :to="{name: 'createAutore'}" custom v-slot="{ isActive, href, navigate }">
            <button class="btn btn-sm btn-primary" @click="navigate">
                <font-awesome-icon icon="fa-solid fa-plus" fixed-width/>
                <span class="ms-1">New</span>
            </button>
        </router-link>
    </header>

    <Table />

</template>

<script>
import Table from './AutoriTable.vue'

export default {
    components: { Table },
    data() {
        return {

        }
    },
    
}
</script>

<style scoped>

</style>