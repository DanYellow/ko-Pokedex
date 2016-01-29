var $ = jQuery = require('jquery');
var _ = require('underscore');
var ko = require('knockout');
var bootstrap = require('bootstrap');


var PokemonManager = require('./PokemonManager');

var Helpers = require('./utils');



/*
  @PokedexManager
  @desc : Manage the pokemon
 */
var PokedexManager = function PokedexManager () {
  var self = this;

  var kantoRange  = { 'name': 'kanto', 'range': [1, 151] };
  var johtoRange  = { 'name': 'johto', 'range': [152, 251] };
  var hoennRange  = { 'name': 'hoenn', 'range': [252, 386] };
  var sinnohRange = { 'name': 'sinnoh', 'range': [387, 493] };
  var unysRange   = { 'name': 'unys', 'range': [494, 629] };
  var kalosRange  = { 'name': 'kalos', 'range': [630, 721] };

  var regionsRange = [kantoRange, johtoRange, hoennRange, sinnohRange, unysRange, kalosRange];


  this.pokemonDatas = ko.observable(false);
  this.pokemonList = ko.observableArray();

  this.pkmnController = new PokemonManager();

  this.fetchPokemon = function fetchPokemon(id) {
    $.ajax({
      url: `http://pokeapi.co/api/v1/pokemon/${id}/`,
      cache: false
    })
    .done(function( pkmn ) {
      self.pokemonDatas(self.pkmnController.object(pkmn));
    });
  }

  this.fetchAllPokemon = function fetchAllPokemon() {
    $.ajax({
      url: "http://pokeapi.co/api/v1/pokedex/1/",
      cache: false
    })
    .done(function( result ) {
      self.fetchPokemonListDatas(result.pokemon);
    });
  }

  this.fetchAllPokemon();

  /*
    @fetchPokemonListDatas
    @desc : Fetch (in national Order) the pokemon list

    @param list - {Array} : The list of Pokemon from the server
   */
  this.fetchPokemonListDatas = function fetchPokemonListDatas(list) {
    var pkmnArray = list.map(function(pkmn) {
      var idDex = pkmn["resource_uri"].split('/').filter(Boolean)[pkmn["resource_uri"].split('/').filter(Boolean).length - 1];
      pkmn["idDex"] = idDex;
      
      pkmn["sprite"] = `http://pokeapi.co/media/img/${idDex}.png`
      

      _.each(regionsRange, (val) => {
        if (Helpers.inRange(idDex, val.range[0], val.range[1])) {
          pkmn["region"] = val.name;
          return true;
        };
      });

      return pkmn;
    });

    pkmnArray = pkmnArray.filter(function(pkmn) {
      if (pkmn["idDex"] > 721) {
        return false;
      } else {
        return true;
      }
    });

    // order pokemon id
    pkmnArray = pkmnArray.sort(function(a, b) {
        return a.idDex - b.idDex;
    });

    self.pokemonList(pkmnArray);
  }
}

ko.bindingHandlers.showModal = {
  init: function (element, valueAccessor) {},
  update: function (element, valueAccessor) {
      var value = valueAccessor();
      if (ko.utils.unwrapObservable(value)) {
          $(element).modal('show');
            // this is to focus input field inside dialog
          }
          else {
            $(element).modal('hide');
          }
      }
  };

module.exports = PokedexManager;