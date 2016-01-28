require('./modules/pokedexManager');


var crossroads = require('crossroads');
var hasher = require('hasher');


//setup crossroads
crossroads.addRoute('home');
crossroads.addRoute('foo');
crossroads.addRoute('lorem/ipsum');
crossroads.routed.add(console.log, console); //log all routes

//setup hasher
function parseHash(newHash, oldHash){
  crossroads.parse(newHash);
  console.log('hash')
}
hasher.initialized.add(parseHash); // parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change