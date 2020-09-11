var fs = require('fs');
var readdirp = require('readdirp');
var wrench = require("wrench");

exports.files = function (pagepath){

  if(fs.existsSync(pagepath)) {

    var files = wrench.readdirSyncRecursive(pagepath);

    for (var i = files.length; i--;) {

      if (files[i].search(/\./i) < 0) {
        files.splice(i, 1);
      }

      files[i] = files[i].replace('\\', '/');

    }

    files.sort();

    console.log("\nfiles created from gallery folder \n\n---- \n");
    console.log(files);
    return files;

  }

};
