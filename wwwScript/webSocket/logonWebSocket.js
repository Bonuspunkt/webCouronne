var NAME = 'name';

function createForm() {
  var form = document.createElement('form');
  form.className = 'nickForm';
  form.innerHTML =
    '<label>Name: <input name="name" /></label>' +
    '<input type="submit" value="submit" />';

  var name = localStorage.getItem(NAME);
  var nameEl = form.querySelector('input[name=name]');
  if (localStorage.getItem(NAME)) {
    nameEl.value = name;
  }

  return form;
}

module.exports = function(socket) {

  socket.addEventListener('message', function(message) {
    var data = JSON.parse(message.data);
    if (data.action === 'auth') {
      // TODO: auth
      var form = createForm();

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        this.parentNode.removeChild(this);

        var name = this.querySelector('input[name=name]').value;
        localStorage.setItem(NAME, name);
        socket.send(JSON.stringify({
          action: 'nick',
          name: name
        }));
      });

      document.body.appendChild(form);
      form.querySelector('input[name=name]').select();
    }
  });

};