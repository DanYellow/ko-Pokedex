var crossroads = require('crossroads');
var hasher = require('hasher');
var ko = require('knockout');

var PokedexManager = require('./modules/pokedexManager');

var pokedexManager = new PokedexManager();

//setup crossroads
crossroads.addRoute('pkmn/{id}', function(id){
  pokedexManager.fetchPokemon(id);
});

crossroads.addRoute('region/{name}', function(name){
  pokedexManager.fetchPokemonByRegion(name);
});

ko.applyBindings(pokedexManager);

crossroads.routed.add(console.log, console); //log all routes


//setup hasher
function parseHash(newHash, oldHash){
  crossroads.parse(newHash);
}
hasher.initialized.add(parseHash); // parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change