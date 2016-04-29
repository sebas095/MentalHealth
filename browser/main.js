const date = require('date-and-time');

document.addEventListener('DOMContentLoaded', function() {
  var now = new Date();
  var tm = date.addDays(now, 3);
  console.log(tm);
});
