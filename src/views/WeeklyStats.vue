<template>
    <div id="main">
        <div class="data-token">
            <input id="token" type="password" v-model="token" @input="getWeeks">
            <div class="multiselect" v-if="displaySearchOptions">
                <multiselect v-model="selectedWeek" :options="selectWeek" :close-on-select="false"
                             :clear-on-select="false" :preserve-search="true" placeholder="Select a Date"
                             label="value" :optionsLimit="50"
                             selectLabel="" deselectLabel="" selectedLabel=""
                             track-by="id" :preselect-first="true">
                    <template slot="option" slot-scope="props">
                        <div class="option__desc">
                            <span class="option__title">{{ props.option.value }}</span>
                            <span class="option__dates">({{ new Date(props.option.firstDay) | moment('DD MMM') }} - {{ new Date(props.option.lastDay) | moment('DD MMM') }})</span>
                        </div>
                    </template>
                    <span slot="noOptions">No Dates available Now.</span>
                    <span slot="noResult">Date not found.</span>
                </multiselect>
            </div>
            <button @click="retrieveStats" v-if="displaySearchOptions">Retrieve Stats</button>
        </div>
        <div id="chartAll" class="chart">
            <apexchart type="area" height="100%" :options="options" :series="series"></apexchart>
        </div>
        <div id="chartViewers" class="chart">
            <apexchart type="area" height="100%" :options="optionsViewers" :series="seriesViewers"></apexchart>
        </div>
    </div>
</template>

<script>
    import '../plugins/apexcharts'

    const chartColors = {
        stream: '#e74c3c',
        viewers: '#3498db',
        games: '#67db7a',
        moyenne: '#ffffff',
        topTen: '#ffd700',
    };

    export default {
        name: "WeeklyStats",
        data() {
            return {
                token: '',
                selectWeek: [],
                selectedWeek: {},
                displaySearchOptions: false,
                options: {
                    chart: {
                        background: '#6441a4',
                        defaultLocale: 'fr',
                        zoom: {
                            autoScaleYaxis: true,
                            zoomedArea: {
                                fill: {
                                    color: '#764bc0',
                                },
                                stroke: {
                                    color: '#9c65ff',
                                },
                            },
                        },
                        locales: [{
                            name: 'fr',
                            options: {
                                months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'September', 'Octobre', 'Novembre', 'Décembre'],
                                shortMonths: ['Jan', 'Frv', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'],
                                days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                                shortDays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                                toolbar: {
                                    download: 'Download SVG',
                                    selection: 'Selection',
                                    selectionZoom: 'Selection Zoom',
                                    zoomIn: 'Zoom In',
                                    zoomOut: 'Zoom Out',
                                    pan: 'Panning',
                                    reset: 'Reset Zoom',
                                },
                            },
                        }],
                    },
                    title: {
                        text: "All Graph",
                        align: 'center',
                        margin: 10,
                        offsetY: 20,
                        style: {
                            fontSize: '20px',
                            color: '#ffa100',
                        },
                    },
                    plotOptions: {
                        line: {
                            curve: 'smooth',
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: .2,
                            opacityFrom: .8,
                            opacityTo: 0,
                            stops: [0, 100],
                        },
                    },
                    theme: {
                        mode: 'dark',
                    },
                    colors: [chartColors.viewers, chartColors.stream, chartColors.moyenne, chartColors.games],
                    tooltip: {
                        enabledOnSeries: undefined,
                        shared: true,
                        x: {
                            show: true,
                            format: 'ddd dd MMM - HH:mm',
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            format: 'dd/MM/yyyy',
                        },
                    },
                    yaxis: [
                        {
                            decimalsInFloat: 0,
                            axisTicks: {
                                show: true,
                            },
                            axisBorder: {
                                show: true,
                                color: chartColors.viewers,
                            },
                            labels: {
                                style: {
                                    color: chartColors.viewers,
                                },
                            },
                            title: {
                                text: "Viewers",
                            },
                        },
                        {
                            decimalsInFloat: 0,
                            opposite: true,
                            axisTicks: {
                                show: true,
                            },
                            axisBorder: {
                                show: true,
                                color: chartColors.stream,
                            },
                            labels: {
                                style: {
                                    color: chartColors.stream,
                                },
                            },
                            title: {
                                text: "Streams",
                            },
                        },
                    ],
                },
                optionsViewers: {
                    chart: {
                        background: '#6441a4',
                        defaultLocale: 'fr',
                        zoom: {
                            autoScaleYaxis: true,
                            zoomedArea: {
                                fill: {
                                    color: '#764bc0',
                                },
                                stroke: {
                                    color: '#9c65ff',
                                },
                            },
                        },
                        locales: [{
                            name: 'fr',
                            options: {
                                months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'September', 'Octobre', 'Novembre', 'Décembre'],
                                shortMonths: ['Jan', 'Frv', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'],
                                days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                                shortDays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                                toolbar: {
                                    download: 'Download SVG',
                                    selection: 'Selection',
                                    selectionZoom: 'Selection Zoom',
                                    zoomIn: 'Zoom In',
                                    zoomOut: 'Zoom Out',
                                    pan: 'Panning',
                                    reset: 'Reset Zoom',
                                },
                            },
                        }],
                    },
                    title: {
                        text: "Viewers Graph",
                        align: 'center',
                        margin: 10,
                        offsetY: 20,
                        style: {
                            fontSize: '20px',
                            color: chartColors.viewers,
                        },
                    },
                    plotOptions: {
                        line: {
                            curve: 'smooth',
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: .2,
                            opacityFrom: .8,
                            opacityTo: 0,
                            stops: [0, 100],
                        },
                    },
                    theme: {
                        mode: 'dark',
                    },
                    colors: [chartColors.viewers, chartColors.topTen],
                    tooltip: {
                        enabledOnSeries: undefined,
                        shared: true,
                        x: {
                            show: true,
                            format: 'ddd dd MMM - HH:mm',
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            format: 'dd/MM/yyyy',
                        },
                    },
                    yaxis: [
                        {
                            decimalsInFloat: 0,
                            axisTicks: {
                                show: true,
                            },
                            axisBorder: {
                                show: true,
                                color: chartColors.viewers,
                            },
                            labels: {
                                style: {
                                    color: chartColors.viewers,
                                },
                            },
                            title: {
                                text: "Streams",
                            },
                        },
                    ],
                },
                series: [
                    {
                        name: "Viewers",
                        data: [],
                    },
                    {
                        name: "Streams",
                        data: [],
                    },
                    {
                        name: "Moyenne (Viewer / Stream)",
                        data: [],
                    },
                    {
                        name: "Games",
                        data: [],
                    },
                ],
                seriesViewers: [
                    {
                        name: "Viewers",
                        data: [],
                    },
                    {
                        name: "Top10 Streamers Viewers",
                        data: [],
                    },
                ],
            }
        },
        methods: {
            retrieveStats() {
                if (this.selectedWeek.data) this.$socket.emit('getStats', {
                    token: this.token,
                    week: this.selectedWeek.data,
                });
            },
            getWeeks() {
                if (this.token !== '') this.$socket.emit('getStatsWeeks', {
                    token: this.token,
                });
            },
        },
        mounted() {
            this.sockets.subscribe('getStats', s => {
                if (!s) return;
                let minViewers = Infinity;
                let minViewerDate;

                s.forEach(e => {
                    if (e.viewerCount < minViewers) {
                        minViewers = e.viewerCount;
                        minViewerDate = e.date;
                    }
                });

                this.series[0].data = s.map(e => {
                    return [e.date, e.viewerCount];
                });

                this.series[1].data = s.map(e => {
                    return [e.date, e.streamCount];
                });

                this.series[2].data = s.map(e => {
                    return [e.date, Math.round((e.viewerCount / e.streamCount) * 100) / 100];
                });

                this.series[3].data = s.map(e => {
                    return [e.date, e.gamesCount];
                });

                this.seriesViewers[0].data = s.map(e => {
                    return [e.date, e.viewerCount];
                });

                this.seriesViewers[1].data = s.map(e => {
                    return [e.date, e.topTenViewerCount];
                });
            });

            this.sockets.subscribe('getStatsWeeks', w => {
                this.displaySearchOptions = w !== false;
                if (w) this.selectWeek = w.map(e => {
                    return {
                        id: `${e.week}-${e.year}`,
                        value: `S ${e.week} - ${e.year}`,
                        firstDay: e.firstDay,
                        lastDay: e.lastDay,
                        data: {
                            week: e.week,
                            year: e.year,
                        },
                    };
                });

                this.selectWeek.reverse();

                this.selectedWeek = this.selectWeek[0];
            })
        },
    }
</script>

<style lang="scss" scoped>
    .data-token {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: .5em;
        text-align: center;
        color: #ffffff;
        background: linear-gradient(to bottom, rgba(100, 65, 164, 0.8) 85%, rgba(100, 65, 164, 0));
        z-index: 1000;

        & > * {
            vertical-align: middle;
        }

        #token {
            display: inline-block;
            margin-right: 10px;
        }

        .multiselect {
            display: inline-block;
            width: auto;
            min-width: 250px;
            transition: .2s ease;


            .option__dates {
                display: block;
                font-size: 12px;
                color: #999999;
            }

            .multiselect__option--highlight .option__dates {
                color: #eeeeee;
            }

            &:hover {
                filter: drop-shadow(0 0 5px #ffffff);
            }

            &:focus {
                filter: drop-shadow(0 0 5px #000000);
            }
        }

        input {
            height: 40px;
            margin: 5px;
            padding: .3em;
            border: 1px solid rgba(255, 255, 255, .5);
            border-radius: 5px;
            font-size: 17px;
            outline: 0;
            box-sizing: border-box;
            transition: .2s ease;
            cursor: pointer;

            &:hover {
                filter: drop-shadow(0 0 5px #ffffff);
            }
        }

        .showToken {
            margin-top: 5px;
            text-align: left;
        }

        button {
            margin-left: 10px;
            padding: 0 40px;
            height: 40px;
            border-radius: 5px;
            border: 0;
            font-size: 16px;
            background: #e67e22;
            color: #ffffff;
            outline: 0;
            transition: .2s ease;
            cursor: pointer;

            &:hover {
                filter: drop-shadow(0 0 5px #e67e22);
            }
        }
    }

    .chart {
        position: relative;
        width: calc(100vw - 15px);
        height: calc(100vh - 66px);
        margin-bottom: 50px;
    }
</style>
