const fs = require('fs');
const path = require('path');

exports.deleteImage = function (options, callback) {
  fs.unlink(options.path, function(err) {
    if (err) console.log('Error: ', err);
    callback();
  });
}

exports.translateImage =  function (option, callback) {
  var tmpPath = option.path;
  var targetPath = option.targetPath;
  var targetName = option.targetName;
  targetPath = path.join(targetPath, targetName);

  var is = fs.createReadStream(tmpPath);
  var os = fs.createWriteStream(targetPath);

  is.pipe(os);
  is.on('end', callback);
}
