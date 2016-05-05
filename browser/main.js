const date = require('date-and-time');

document.addEventListener('DOMContentLoaded', function() {
  var now = new Date();
  for (var i = 0; i < 7; i++) {
    var tm = date.addDays(now, i);
    var text = document.createTextNode(tm);
    //document.querySelector("#test").appendChild(text);
  }
});
