<template>
    <main>
        <div class="card">
            <div class="card-body">
                <h1 class="card-title">Oops, page not found!</h1>
                <p>We're sorry, but the page you're looking for cannot be found. It may have been removed, renamed, or is temporarily unavailable.</p>
                <p>Here are a few things you can try:</p>
                <ul>
                    <li>Check the URL to make sure it's spelled correctly.</li>
                    <li>Go back to the previous page and try again.</li>
                    <li>Use the search bar to look for the content you're after.</li>
                    <li>Visit our homepage to see if you can find what you're looking for.</li>
                    <li>If none of these options work, please don't hesitate to contact us for further assistance.</li>
                </ul>
                <p>We apologize for any inconvenience this may have caused and thank you for your patience.</p>
                <router-link class="btn btn-primary" :to="{name: 'home'}">Go to Homepage</router-link>
            </div>
        </div>
    </main>
</template>

<script>

export default {
    setup () {

    }
}
</script>

<style scoped>
main {
    max-width: 500px;
    margin: 0 auto;
}
</style>