var fs = require('fs');
var readdirp = require('readdirp');
var wrench = require("wrench");

exports.lessfiles = function (projectdir) {

  var lessfiles = wrench.readdirSyncRecursive(projectdir + "/components").reverse();
  var lesstxt = "";

  for (var i = lessfiles.length; i--;) {

    if (lessfiles[i].indexOf('less') > -1) {

      text = lessfiles[i].replace(/\\/g,"/");
      lesstxt += "@import '" + projectdir + "/components/" + text + "';\n";

    }

  }

  fs.writeFile(projectdir + "/theme/import.less", lesstxt, function (err) {
    if (err) throw err;
    console.log('\nLess imports saved to /theme/import.less \n\n---- \n');
  });

  return lesstxt;

};
