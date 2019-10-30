const axios = require('axios');
const colors = require('colors');

class Streams {

    constructor() {
        this.streams = [];
        this.gamesList = [];

        this.fetchStreams = [];
        this.fetchStreamsIDs = [];
        this.fetchEvery = 5 * 60 * 1000;
        this.bearer = '';

        axios.post('https://id.twitch.tv/oauth2/token?client_id=9wfpzql7zbopr9v8wvuai5i4vz2m6w&client_secret=3c0pkwf5mrq8prinzvcm8xeizfx8mw&grant_type=client_credentials')
            .then(r => {
                this.bearer = r.data.access_token;
                this.startFetchStreams();
            });

        this.events = {
            'fetchFinished': () => {
            },
        };
    }

    /// GETTER FUNCTIONS

    pickRandomStream(games) {
        if (!games || games.length < 1) return this.streams[Math.floor(Math.random() * this.streams.length)];
        else {
            let selectedStreams = this.streams.filter(s => games.includes(parseInt(s.game_id)));
            return selectedStreams[Math.floor(Math.random() * selectedStreams.length)];
        }
    }

    getStreamsCount(games) {
        if (!games || games.length < 1) return this.streams.length;
        else {
            return this.streams.filter(s => games.includes(parseInt(s.game_id))).length;
        }
    }

    streamsCount() {
        return this.streams.length;
    }

    getGames() {
        return this.gamesList;
    }

    /// EVENT FUNCTIONS

    onFetchFinished(event) {
        this.events.fetchFinished = event;
    }

    /// FETCHING FUNCTIONS

    startFetchStreams() {
        console.log('NEXT FETCH'.yellow, (new Date(Date.now() + this.fetchEvery)).toLocaleTimeString('fr-FR').magenta);
        this.startGetStreams();

        setTimeout(() => {
            this.startFetchStreams();
        }, this.fetchEvery);
    }

    tryAddStream(stream) {
        if (!this.fetchStreamsIDs.includes(stream.id) && stream.type === 'live') {
            this.fetchStreams.push(stream);
            this.fetchStreamsIDs.push(stream.id);
        }
    }

    startGetStreams() {
        console.log('FETCHING STREAMS'.cyan);
        this.fetchStreams = [];
        this.fetchStreamsIDs = [];

        axios.get('https://api.twitch.tv/helix/streams?language=fr&first=100', {
            headers: {
                'Client-ID': '9wfpzql7zbopr9v8wvuai5i4vz2m6w',
                'Authorization': `Bearer ${this.bearer}`,
            },
        }).then(r => {
            r.data.data.forEach(e => {
                this.tryAddStream(e);
            });

            this.getNextPage(r.data.pagination.cursor);
        });
    }

    getNextPage(cursor) {
        axios.get(`https://api.twitch.tv/helix/streams?language=fr&first=100&after=${cursor}`, {
            headers: {
                'Client-ID': '9wfpzql7zbopr9v8wvuai5i4vz2m6w',
                'Authorization': `Bearer ${this.bearer}`,
            },
        }).then(r => {
            r.data.data.forEach(e => {
                this.tryAddStream(e);
            });

            if (r.data.data.length === 100) this.getNextPage(r.data.pagination.cursor);
            else {
                this.streams = this.fetchStreams;

                console.log('STEAMS FETCHED'.cyan);
                this.events.fetchFinished(this.streams);
                this.fetchGames();
            }
        }).catch(e => {
            console.log(e);
            let resetTimeStamp = parseInt(e.response.headers['ratelimit-reset']);
            let resetIn = (resetTimeStamp * 1000) - Date.now();

            console.error('ERROR | Retry in:'.red, `${resetIn / 1000} s`.magenta);

            if (e.response.status) setTimeout(() => {
                this.getNextPage(cursor);
            }, resetIn);
        });
    }

    async fetchGames() {
        console.log('FETCHING GAMES'.blue)
        let gamesIds = [];
        let games = {};

        this.streams.forEach(s => {
            if (!gamesIds.includes(s.game_id)) gamesIds.push(s.game_id);
        });

        for (let i = 0; i < Math.ceil(gamesIds.length / 100); i++) {
            let isLastPart = (i === Math.ceil(gamesIds.length / 100));

            let idList = [];
            for (let j = i * 100; j < i * 100 + 100; j++) {
                idList.push(`id=${gamesIds[j]}`);
            }

            await axios.get(`https://api.twitch.tv/helix/games?${idList.join('&')}`, {
                headers: {
                    'Client-ID': '9wfpzql7zbopr9v8wvuai5i4vz2m6w',
                    'Authorization': `Bearer ${this.bearer}`,
                },
            }).then(d => {
                d.data.data.forEach(g => {
                    games[g.id] = {
                        name: g.name,
                        imgUrl: g.box_art_url,
                    };
                })
            });
        }

        games.length = Object.keys(games).length;
        this.gamesList = games;

        console.log('GAMES FETCHED'.blue)
    }
}

module.exports = () => {
    return new Streams;
};
