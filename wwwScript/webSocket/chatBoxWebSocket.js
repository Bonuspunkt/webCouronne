var safeJson = require('./safeJson');

module.exports = function(chatBox, channel) {
  var historyEl = chatBox.querySelector('ul');
  var messageEl = chatBox.querySelector('input[name=message]');
  var submitEl = chatBox.querySelector('input[type=submit]');
  submitEl.addEventListener('click', function(e) {
    e.preventDefault();

    var message = messageEl.value;
    channel.send({ msg: message });

    messageEl.value = '';
  });

  channel.on('join', function(name) {
    var li = document.createElement('li');
    li.className = 'join';
    li.textContent = name + ' joined';
    historyEl.appendChild(li);
  });

  channel.on('msg', function(name, msg) {
    li = document.createElement('li');
    li.textContent = name + ': ' + msg;
    historyEl.appendChild(li);
  });

  channel.on('part', function(name) {
    li = document.createElement('li');
    li.className = 'part';
    li.textContent = name + ' parted';
    historyEl.appendChild(li);
  });

};
