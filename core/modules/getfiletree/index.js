var fs = require('fs');
var readdirp = require('readdirp');
var wrench = require("wrench");

exports.filetree = function (pagepath) {


  var filetree = wrench.readdirSyncRecursive(pagepath);


  console.log("\n\nOriginal filetree \n\n---- \n\n");
  console.log(filetree);
  console.log("\n\n---- \n");

  function getOrder(file) {

    var data = fs.readFileSync(pagepath + file + '.ejs', 'utf8');

    dataCheck = data.slice(5, 10);

    if (dataCheck === "order") {

      data = data.slice(12, 14);

    } else {

      data = "xx";

    }


    console.log(data);
    return data;

  };


  for (var i = filetree.length; i--;) {

    if (filetree[i].search('ejs') === -1) {
      filetree.splice(i, 1);
      continue;
    }

    filetree[i] = filetree[i].replace('.ejs', '');
    filetree[i] = filetree[i].replace(/\\/g, '/');
    filetree[i] = filetree[i].replace(' -', '');
    filetree[i] = getOrder(filetree[i]) + '-' + filetree[i];
    if (filetree[i].search('xx-') !== -1) { filetree.splice(i, 1); }

  }

  filetree.sort();
  var menu = {};
  function add(item, level) {
    var nextItem = textTree[level++];
    if (nextItem !== undefined) {
      if(!item[nextItem]) {
        item[nextItem] = {};
      }
      add(item[nextItem], level++);
    }
  }
  function generateMenuTree(items, menu){
    items.forEach(function(i){
      var level = 0;
      textstring = i;
      textTree = textstring.split('/');
      add(menu, level);
    })
  }

  for (var i = filetree.length; i--;) {
    filetree[i] = filetree[i].slice(3);

//    if (getOrder(filetree[i]) === "x")  {
//
//      filetree = filetree.splice(i, 1);
//
//    }

  }

  generateMenuTree(filetree, menu);
  console.log("\nFiletree modified by generateMenu function \n\n---- \n\n");
  console.log(filetree);
  console.log("\n\n---- \n");
  return menu;


  console.log("\nFiletree modified by getfiletree module \n\n---- \n\n");
  console.log(filetree);
  console.log("\n\n---- \n");
  return filetree;

};
