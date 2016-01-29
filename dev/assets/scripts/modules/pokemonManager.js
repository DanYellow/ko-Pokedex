var _ = require('underscore');
var Helpers = require('./utils');

/*
  @PokedexManager
  @desc : Manage the pokemon datas from the server
 */

var PokemonManager = function PokemonManager (datas) {
 
  // datas["types"] = this.types(datas["types"]);
  
}

PokemonManager.prototype.object = function(datas) {
  datas['moves'] = this.moves(datas['moves']);
  var idDex = datas["national_id"];
  datas['sprite'] = `http://pokeapi.co/media/img/${idDex}.png`

  datas['evolutions'] = this.evolutions(datas['evolutions']);

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
  var tempMoves = _.mapObject(_.groupBy(moves, 'learn_type'), function(moves) {
    
    return _.sortBy(moves, 'level');
  });

  return tempMoves;
  
};

PokemonManager.prototype.evolutions = function(evolutions) {
  var idDex = 0
  return _.map(evolutions, function(evol) {
    idDex = Helpers.idDex(evol); 
    evol['sprite'] = `http://pokeapi.co/media/img/${idDex}.png`
    evol['idDex'] = idDex;

    return evol;
  });
};

module.exports = PokemonManager; 


