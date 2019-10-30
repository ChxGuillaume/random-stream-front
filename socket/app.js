const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Streams = require('./Streams.class')();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('getFirstData', () => {
        socket.emit('getFirstData', {
            streamersCount: Streams.streamsCount(),
        });
    });

    socket.on('getGames', () => {
        socket.emit('getGames', Streams.getGames());
    });

    socket.on('getStreams', () => {
        socket.emit('getStreams', Streams.streams);
    });

    socket.on('pickRandom', (games) => {
        socket.emit('pickRandom', Streams.pickRandomStream(games));
    });

    socket.on('streamsCount', (games) => {
        socket.emit('streamsCount', Streams.getStreamsCount(games));
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');

    Streams.onFetchFinished(() => {
        io.emit('newFetch', {
            streamersCount: Streams.streamsCount(),
        });

        io.emit('getGames', Streams.getGames());
    });
});
