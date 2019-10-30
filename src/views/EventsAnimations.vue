<template>
    <div id="animation">
        <svg id="eventsLogo" viewBox="0 0 832.9 787.71">
            <text class="cls-1 first" transform="translate(0 281.61)">E</text>
            <text class="cls-1 second" transform="translate(280 281.61)">V</text>
            <text class="cls-1 third" transform="translate(582 281.61)">E</text>
            <text class="cls-1 fourth" transform="translate(0 713.61)">N</text>
            <text class="cls-1 fifth" transform="translate(290 713.61)">T</text>
            <text class="cls-1 sixth" transform="translate(582 713.61)">S</text>
        </svg>
        <svg id="ztLogo" viewBox="0 0 941 1024">
            <polygon
                    points="941 409 830 557 623 555 623 809 444 1024 444 556 57 556 387 139 0 139 112 0 728 0 391 413 941 409"/>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "EventsAnimations",
        methods: {
            animateAll() {
                let this_ = this;
                let easing = 'easeOutElastic';
                let duration = 1250;
                let baseDelay = 1500;
                let delayPerEl = 100;

                this.$anime.timeline()
                    .add({
                        targets: '.first',
                        translateY: [281.61, 281.61 + 70],
                        translateX: [-400, 0],
                        skewX: ['-20deg', '0deg'],
                        opacity: [0, 1],
                        easing,
                        duration,
                        delay: baseDelay,
                    });

                this.$anime.timeline()
                    .add({
                        targets: '.second',
                        translateY: [0, 281.61 - 20], //translate(280, 281.61);
                        translateX: [280, 280],
                        skewY: ['-30deg', '0deg'],
                        opacity: [0, 1],
                        easing,
                        duration,
                        delay: delayPerEl + baseDelay,
                    });

                this.$anime
                    .timeline()
                    .add({
                        targets: '.third',
                        translateY: [281.61, 281.61 + 70], //translate(582, 281.61);
                        translateX: [582 + 400, 582],
                        skewX: ['20deg', '0deg'],
                        opacity: [0, 1],
                        easing,
                        duration,
                        delay: 2 * delayPerEl + baseDelay,
                    });

                this.$anime.timeline()
                    .add({
                        targets: '.fourth',
                        translateY: [713.61 + 200, 713.61 - 30], //translate(0, 713.61);
                        translateX: [0, 0],
                        skewY: ['30deg', '0deg'],
                        opacity: [0, 1],
                        easing,
                        duration,
                        delay: 3 * delayPerEl + baseDelay,
                    });

                this.$anime.timeline()
                    .add({
                        targets: '.fifth',
                        translateY: [713.61 + 300, 713.61 + 60], //translate(290, 713.61); -- 771.61px
                        translateX: [290, 290],
                        rotateY: [360, 0],
                        opacity: [0, 1],
                        easing,
                        duration,
                        delay: 4 * delayPerEl + baseDelay,
                    });

                this.$anime.timeline()
                    .add({
                        targets: '.sixth',
                        translateY: [713.61 + 200, 713.61 - 30], //translate(582, 713.61);
                        translateX: [582, 582],
                        skewY: ['30deg', '0deg'],
                        opacity: [0, 1],
                        easing,
                        duration,
                        delay: 5 * delayPerEl + baseDelay,
                    });

                this.$anime.timeline()
                    .add({
                        targets: 'svg#eventsLogo',
                        translateX: [0, -45, 45, 0],
                        scale: [1, 1.1, 1.1, 1],
                        skewX: [0, 1, -1, 0],
                        easing,
                        duration: 1250,
                        delay: 5 * delayPerEl + baseDelay + duration - 250,
                    });

                this.$anime.timeline()
                    .add({
                        targets: 'svg#ztLogo',
                        scale: [0, .15],
                        rotate: [0, 360 * 2],
                        easing,
                        duration: 1250,
                        delay: 5 * delayPerEl + baseDelay + duration + 750,
                        complete: function () {
                            setTimeout(() => {
                                this_.$anime
                                    .timeline()
                                    .add({
                                        targets: 'svg',
                                        opacity: [1, 0],
                                        easing: 'easeInOutQuart',
                                        duration: 1250,
                                        complete: function () {
                                            setTimeout(() => {
                                                this_.$anime
                                                    .timeline()
                                                    .add({
                                                        targets: 'svg',
                                                        opacity: 1,
                                                        easing: 'easeInOutQuart',
                                                        duration: 0,
                                                    });

                                                this_.animateAll();
                                            }, 500);
                                        },
                                    });
                            }, 500);
                        },
                    });
            },
        },
        mounted() {
            this.animateAll();
        },
    }
</script>

<style>
    body {
        background: black;
        overflow: hidden;
    }

    #animation {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        max-width: 100vw;
        max-height: 100vh;

        margin: auto;

        user-select: none;

        fill: white;
    }

    .cls-1 {
        font-size: 325px;
        font-family: PRIMETIME-Regular, PRIMETIME;
        transform-origin: 15% -17%;
    }
</style>
