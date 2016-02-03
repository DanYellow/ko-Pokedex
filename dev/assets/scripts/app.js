var crossroads = require('crossroads');
var hasher = require('hasher');
var ko = require('knockout');

var PokedexManager = require('./modules/pokedexManager');

var pokedexManager = new PokedexManager();

//setup crossroads
crossroads.addRoute('pkmn/{id}', function(id){
  pokedexManager.fetchPokemon(id);
  document.getElementById('loader').classList.remove("is-hidden");
});

crossroads.addRoute('region/{name}', function(name){
  pokedexManager.fetchPokemonByRegion(name);
  document.getElementById('loader').classList.remove("is-hidden");
});

crossroads.addRoute(':rest*:', function(name){
  pokedexManager.fetchPokemonByRegion('all');
}, -Infinity);

ko.applyBindings(pokedexManager);

// crossroads.routed.add(console.log, console); //log all routes


//setup hasher
function parseHash(newHash, oldHash){
  crossroads.parse(newHash);
}
hasher.initialized.add(parseHash); // parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change