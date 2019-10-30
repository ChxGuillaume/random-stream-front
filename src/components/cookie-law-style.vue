<template>
    <cookie-law theme="twitchTheme" buttonText="J'ai compris">
        <div slot="message" class="test">
            Ce site utilise les Cookies (🍪) pour une meilleur experience.
        </div>
    </cookie-law>
</template>

<script>
    import CookieLaw from 'vue-cookie-law'

    export default {
        name: "cookie-law-style",
        components: {CookieLaw},
    }
</script>

<style lang="scss">
    .Cookie--twitchTheme {
        background: #424851;
        color: #fff;
        padding: 1.25em;

        .Cookie__button {
            background: linear-gradient(to left, #6441a4, #905bea);
            padding: .625em 3.125em;
            color: #fff;
            border-radius: 0;
            border: 0;
            font-size: 1em;
            transition: .2s ease;
        }

        .Cookie__button:hover {
            background: linear-gradient(to left, #8959e1, #9e62ff);
        }
    }
</style>
