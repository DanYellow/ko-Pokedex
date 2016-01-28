var _ = require('underscore');

/*
  @PokedexManager
  @desc : Manage the pokemon datas from the server
 */

var PokemonManager = function PokemonManager (datas) {
 
  // datas["types"] = this.types(datas["types"]);
  
}

PokemonManager.prototype.object = function(datas) {
  datas["moves"] = this.moves(datas["moves"]);
  var idDex = datas["national_id"];
  datas["sprite"] = `http://pokeapi.co/media/img/${idDex}.png`

  return datas;
};

/*
    @desc : get Pokemon's types

    @returns : return array
 */
PokemonManager.prototype.types = function(typesArray) {
  return _.pluck(typesArray, 'name');
};

PokemonManager.prototype.moves = function(moves) {
  
  return _.groupBy(moves, 'learn_type');
};

module.exports = PokemonManager; 


