var initialized = false;
var voice = null;

window.speechSynthesis.onvoiceschanged = function() {
  speechSynthesis.cancel();
  voice = speechSynthesis.getVoices().filter(function (v) {
    return ~v.name.indexOf('français')
  })[0];
};
var socket = io();

socket.on('tweet', function(data) {
  if (voice !== null && !~data.text.indexOf('https')) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = data.text;
    msg.voice = voice;
    speechSynthesis.speak(msg);
    msg.onend = function(event) {
      speechSynthesis.cancel();
    }
    msg.onstart = function(event) {
      document.getElementById('text').innerHTML = data.text;
      document.getElementById('image').src = data.avatar;
    }
  }
});
