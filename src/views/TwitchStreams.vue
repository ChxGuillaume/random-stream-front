<template>
    <div id="main">
        <div class="logo">
            <fa-icon id="logo" :icon="[ 'fab', 'twitch' ]"></fa-icon>
        </div>
        <div class="multiselect">
            <label class="typo__label">Selectionner le(s) jeu(x) que vous aimez voir. <span class="streamerCount">Streams: {{ streamersCountGame }} / {{ streamersCount }}</span></label>
            <multiselect v-model="selectedGames" :options="games" :multiple="true" :close-on-select="false"
                         :clear-on-select="false" :preserve-search="true" placeholder="Selectionner des jeux"
                         label="value" :optionsLimit="50"
                         selectLabel="Entrer pour sélectionner." deselectLabel="Entrer pour désélectionner."
                         track-by="id" :preselect-first="true" @input="streamGamesCount">
                <template slot="option" slot-scope="props">
                    <img class="option__image" :src="props.option.img" :alt="props.option.value">
                    <div class="option__desc">
                        <span class="option__title">{{ props.option.value }}</span>
                        <span class="option__small">({{ props.option.streamCount }} {{ props.option.streamCount === 1 ? 'stream' : 'streams' }})</span>
                    </div>
                </template>
                <span slot="noOptions">Aucun jeu n'est disponnible pour le moment.</span>
                <span slot="noResult">Le jeu que vous chercher n'est pas streamer ! Veuillez essayer autre chose.</span>
            </multiselect>
        </div>
        <button id="searchBtn" @click="openRandomStream">J'ai de la chance !</button>
        <div class="credits">
            <span>Made with <fa-icon icon="heart"/> by
                <a href="https://twitter.com/_nekotiki_" target="_blank">
                    <span>NekoTiki</span>
                </a>
            </span>
        </div>
        <cookie-law-style></cookie-law-style>
        <visit-history></visit-history>
    </div>
</template>

<script>
    import CookieLawStyle from "../components/cookie-law-style";
    import VisitHistory from "../components/VisitHistory";

    export default {
        name: "TwitchStreams",
        components: {VisitHistory, CookieLawStyle},
        data() {
            return {
                streamersCount: 0,
                streamersCountGame: 0,
                games: [],
                selectedGames: [],
            }
        },
        methods: {
            tryAddStream(stream) {
                if (!this.streamsIds.includes(stream.id) && stream.type === 'live') {
                    this.streams.push(stream);
                    this.streamsIds.push(stream.id);
                }
            },
            getNextPage(cursor) {
                this.$axios.get(`https://api.twitch.tv/helix/streams?language=fr&first=100&after=${cursor}`, {
                    headers: {'Client-ID': process.env.VUE_APP_TWITCH_CLIENT_ID},
                }).then(r => {
                    let streams = r.data.data;

                    streams.forEach(e => {
                        this.tryAddStream(e);
                    });

                    if (r.data.data.length === 100) this.getNextPage(r.data.pagination.cursor);
                })
            },
            openRandomStream() {
                this.$socket.emit('pickRandom', {
                    session: this.$cookies.get('session'),
                    games: this.selectedGames.map(e => e.id),
                });
            },
            streamGamesCount() {
                this.$socket.emit('streamsCount', this.selectedGames.map(e => e.id));
            },
        },
        mounted() {
            this.sockets.subscribe('getStreams', d => {
                this.streams = d;
            });

            this.sockets.subscribe('pickRandom', d => {
                window.open(`https://twitch.tv/${d.user_name}`, '_blank');

                this.$socket.emit('getVisits', {
                    session: this.$cookies.get('session')
                });
            });

            this.sockets.subscribe('getFirstData', d => {
                this.streamersCount = d.streamersCount;
                this.streamersCountGame = this.streamersCount;
            });

            this.sockets.subscribe('newFetch', d => {
                this.streamersCount = d.streamersCount;
                this.streamGamesCount();
            });

            this.sockets.subscribe('getGames', g => {
                this.games = [];
                Object.keys(g.games).forEach(e => {
                    if (e !== 'length')
                        this.games.push({
                            id: parseInt(e),
                            value: g.games[e].name,
                            streamCount: g.games[e].streamCount,
                            img: g.games[e].imgUrl.replace('{width}', '40').replace('{height}', '50'),
                        });
                });

                this.games.sort((a, b) => {
                    return a.value.localeCompare(b.value);
                });
            });

            this.sockets.subscribe('streamsCount', c => {
                this.streamersCountGame = c;
            });

            this.sockets.subscribe('initSession', s => {
                this.$cookies.set('session', s, '2y');
            });

            this.$socket.emit('initSession', {
                session: this.$cookies.get('session'),
            });

            this.$socket.emit('getFirstData');
            this.$socket.emit('getGames');

            let logo = document.getElementById('logo');

            this.$anime
                .timeline({
                    loop: true,
                    duration: 10000,
                })
                .add({
                    targets: logo,
                    rotate: 50,
                    duration: 1500,
                })
                .add({
                    targets: logo,
                    rotate: 0,
                    duration: 1500,
                })
                .add({
                    targets: logo,
                    translateY: -50,
                    duration: 1500,
                }, 2600)
                .add({
                    targets: logo,
                    translateY: 0,
                    duration: 1500,
                }, 2800)
                .add({
                    targets: logo,
                    translateY: 0,
                    duration: 1500,
                }, 10000);
        },
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>
    #main table {
        margin: 40px auto auto;
    }

    #main button {
        margin-top: 40px;
        padding: 10px 15px;
        outline: 0;
        border: 0;
        font-size: 20px;
        color: #ffffff;
        background: #ff6464;
        border-radius: 4px;
        cursor: pointer;
        transition: .2s ease;
    }

    #main button:hover {
        background: #ff7171;
        filter: drop-shadow(0px 0px 8px #ff6464);
    }

    .logo {
        margin-bottom: 40px;
    }

    .logo svg {
        width: 200px;
        height: 200px;
        color: #ffffff;
    }

    .multiselect {
        margin: auto;
        max-width: 600px;
    }

    label {
        display: block;
        margin-bottom: 10px;
        color: #ffffff;

        span {
            display: inline-block;
            margin: 5px 0;
        }
    }

    .option__image, .option__desc {
        margin: 0 5px;
        display: inline-block;
        vertical-align: middle;
    }

    .option__desc {
        & > span {
            display: block;
        }

        .option__small {
            font-size: 12px;
            color: #999999;
        }
    }

    .multiselect__option--highlight .option__desc .option__small {
        color: #eeeeee;
    }

    .streamerCount {
        padding: 2px 4px;
        color: #ffffff;
        background: rgba(255, 255, 255, .2);
        border-radius: 4px;
    }

    .credits {
        position: fixed;
        bottom: 15px;
        left: 0;
        right: 0;
        color: #ffffff;
    }

    .credits svg {
        color: #e31b23;
        animation: linear 2s heart infinite;
    }

    @keyframes heart {
        0% { transform: scale(.8); }
        50% { transform: scale(1.2); }
        100% { transform: scale(.8); }
    }

    .credits a {
        position: relative;
        display: inline-block;
        padding: 1px 3px;
        color: #e31b23;
        text-decoration: none;
        transition: .2s ease;
    }

    .credits a:hover {
        color: #ffffff;
    }

    .credits a span {
        position: relative;
        display: block;
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.11));
        z-index: 10;
    }

    .credits a:before {
        content: '';
        position: absolute;
        top: -2px;
        right: 0;
        display: block;
        width: 0;
        height: 2px;
        background: #e31b23;
        border-radius: 2px;
        transition: width .2s ease .2s, height .2s ease;
    }

    .credits a:hover:before {
        top: auto;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: width .2s ease, height .2s ease .2s;
    }
</style>
