var express  = require('express'),
    http     = require('http'),
    socketio = require('socket.io'),
    twitter  = require('twitter'),
    path = require('path');

var app = express();
var port = 8001;

// app
app.use('/static', express.static('public'));
app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
var server = http.createServer(app).listen(port, function() {});

//socket.io
var io = socketio.listen(server);

// twitter
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var streamParams = {locations: '2.270216,48.8240473,2.413167,48.8964532'}; // Paris 
client.stream('statuses/filter', streamParams, function(stream){
  stream.on('data', function(data) {
    var tweet = {
      author: data['user']['name'],
      avatar: data['user']['profile_image_url'],
      text: data['text'],
      date: data['created_at']
    };
    io.emit('tweet', tweet);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
