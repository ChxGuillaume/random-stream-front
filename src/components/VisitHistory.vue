<template>
    <div id="visitHistory" :class="{ 'opened': opened }">
        <div class="results">
            <a class="icon" @click="opened = !opened" title="Historique des Stream visiter">
                <fa-icon icon="history"/>
            </a>
            <div class="table">
                <div class="title">Votre Historique</div>
                <div class="table-container">
                    <div class="empty" v-if="visits.length === 0">Votre historique est vide.</div>
                    <a :href="`https://twitch.tv/${v.name}`" target="_blank" class="row" v-for="v in visits" :key="v.date">
                        <span class="date">{{ new Date(v.date) | moment("ddd Do MMMM YYYY HH:mm") }}</span>
                        <span class="name">
                            {{ v.name }}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "VisitHistory",
        data() {
            return {
                opened: false,
                visits: [],
            }
        },
        mounted() {
            this.sockets.subscribe('getVisits', (visitList) => {
                this.visits = visitList;
            });

            this.$socket.emit('getVisits', {
                session: this.$cookies.get('session'),
            });
        },
    }
</script>

<style lang="scss" scoped>
    #visitHistory {
        position: fixed;
        top: 0;
        right: 0;
        color: #ffffff;
        text-align: right;

        .icon {
            position: absolute;
            top: 0;
            left: 0;
            display: inline-block;
            padding: 15px;
            cursor: pointer;
            transition: .2s ease;
            transform: translate(-100%);

            &:hover {
                filter: drop-shadow(0 0 10px #0f0918);
                transform: translate(-100%) rotate(-1turn) scale(1.2);
            }

            svg {
                width: 25px;
                height: 25px;
            }
        }

        .results {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            height: 100vh;
            background: #47337a;
            transform: translate(100%);
            transition: .2s ease;
        }

        &.opened {
            .results {
                transform: translate(0);
            }
        }

        .table {
            display: block;
            min-width: 170px;
            max-height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-color: #9e62ff #47337a;
            scrollbar-width: thin;

            .empty {
                color: #dddddd;
                text-align: center;
            }

            .title {
                padding: 15px 0;
                text-align: center;
                font-size: 20px;
                font-style: italic;
            }

            .row {
                display: block;
                padding: 10px;
                color: #ddf7e7;
                text-decoration: none;
                transition: .2s ease;

                &:hover {
                    background: rgba(255, 255, 255, .3);
                }

                span {
                    display: block;
                    width: max-content;
                    margin: auto;

                    &.name {
                        color: #2ecc71;
                        text-decoration: underline;
                        transition: .2s ease;
                    }
                }
            }

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: #47337a;
            }

            &::-webkit-scrollbar-thumb {
                background: #9e62ff;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        }
    }
</style>
