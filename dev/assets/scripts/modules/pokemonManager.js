var _ = require('underscore');
var Helpers = require('./utils');

/*
  @PokedexManager
  @desc : Manage the pokemon datas from the server
 */

var PokemonManager = function PokemonManager (datas) {
 
  var kantoRange  = { 'name': 'kanto', 'range': [1, 151] };
  var johtoRange  = { 'name': 'johto', 'range': [152, 251] };
  var hoennRange  = { 'name': 'hoenn', 'range': [252, 386] };
  var sinnohRange = { 'name': 'sinnoh', 'range': [387, 493] };
  var unysRange   = { 'name': 'unys', 'range': [494, 649] };
  var kalosRange  = { 'name': 'kalos', 'range': [650, 721] };

  this.regions = [kantoRange, johtoRange, hoennRange, sinnohRange, unysRange, kalosRange];
}

PokemonManager.prototype.object = function(datas) {
  datas['moves'] = this.moves(datas['moves']);
  var idDex = datas["national_id"];
  datas['sprite'] = `http://pokeapi.co/media/img/${idDex}.png`

  datas['evolutions'] = this.evolutions(datas['evolutions']);

  datas['region'] = this.region(idDex)

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

PokemonManager.prototype.region = function(idDex) {
  var region;
  _.each(this.regions, (val) => {
    if (Helpers.inRange(idDex, val.range[0], val.range[1])) {
      region = val.name;
      return true;
    };
  });

  return region;
};

module.exports = PokemonManager; 


