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
  var unysRange   = { 'name': 'unys', 'range': [494, 649] };
  var kalosRange  = { 'name': 'kalos', 'range': [650, 721] };


  this.regions = [kantoRange, johtoRange, hoennRange, sinnohRange, unysRange, kalosRange];

  this.underscore = _;


  console.log(_.pluck(this.regions, "name"));
  this.pokemonDatas = ko.observable(false);
  this.pokemonList = ko.observableArray();

  this.pokemonListAll = [];

  this.pkmnController = new PokemonManager();

  this.dexItemEnded = _.debounce(this.pkmnListRenderingEnd, 100);

  this.fetchPokemon = function fetchPokemon(id) {
    $.ajax({
      url: `http://pokeapi.co/api/v1/pokemon/${id}/`,
      cache: false
    })
    .done(function( pkmn ) {
      var pkmnProcessed = self.pkmnController.object(pkmn);
      self.pokemonDatas(pkmnProcessed);
      self.fetchPokemonByRegion(pkmnProcessed['region'])
    });
  }

  this.fetchAllPokemon = function fetchAllPokemon(region) {
    $.ajax({
      url: "http://pokeapi.co/api/v1/pokedex/1/",
      cache: false
    })
    .done(function( result ) {
      self.fetchPokemonListDatas(result.pokemon, region);
    });
  }
  

  this.fetchPokemonByRegion = function fetchPokemonByRegion(regionName) {
    document.getElementById('loader').classList.remove("is-hidden");
    if (self.pokemonListAll.length === 0) {
      self.fetchAllPokemon(regionName);

      return;
    };

    regionName = String(regionName).toLowerCase();

    // If the region name doesn't exist
    if ( Object.keys(self.regions).indexOf(regionName) > -1 || regionName === String('tseho').toLowerCase() ) {
      self.pokemonList(self.pokemonListAll);
    };
    var pkmnRegion =  _.filter(self.pokemonListAll, function(pkmn){
      /*
        TSEHO MODE
        S
        E
        H
        O

        M
        O
        D
        E
       */
      // if the filter is equals to "Tseho", it return only pokemon of the first generation
      if (regionName === "tseho" && String(pkmn.region).toLowerCase() == "kanto".toLowerCase()) {
        return true;
      }
      return String(pkmn.region).toLowerCase() === regionName; 
    } );
    self.pokemonList(pkmnRegion);
  }

  

  /*
    @fetchPokemonListDatas
    @desc : Fetch (in national Order) the pokemon list

    @param list - {Array} : The list of Pokemon from the server
   */
  this.fetchPokemonListDatas = function fetchPokemonListDatas(list, region) {
    var pkmnArray = list.map(function(pkmn, index) {
      var idDex = Helpers.idDex(pkmn);
      pkmn["idDex"] = idDex;
      pkmn["sprite"] = `http://pokeapi.co/media/img/${idDex}.png`
      
      // We assignate to the Pokemon its regions (aka his generation)
      _.each(self.regions, (val) => {
        if (Helpers.inRange(idDex, val.range[0], val.range[1])) {
          pkmn["region"] = val.name;
          return true;
        };
      });

      return pkmn;
    });

    // We remove extra transformations (Mega-Evolutions, Forms-A/B/C/Whatever)
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

    // It's the first time we display the datas
    if (self.pokemonListAll.length === 0) {
      var pkmnArrayFilter = pkmnArray.filter(function(pkmn) {
        return String(pkmn.region).toLowerCase() === region; 
      });
     
      if (pkmnArrayFilter.length === 0) {
        pkmnArrayFilter = pkmnArray;
      };


      self.pokemonList(pkmnArrayFilter);
    };

    self.pokemonListAll = pkmnArray;
  }
}

PokedexManager.prototype.pkmnListRenderingEnd = function () {
  document.getElementById('loader').classList.add("is-hidden");
}

ko.bindingHandlers.showModal = {
  init: function (element, valueAccessor) {},
  update: function (element, valueAccessor) {
      var value = valueAccessor();
      document.getElementById('loader').classList.remove("is-hidden");

      $(element).on('shown.bs.modal', function() {
        document.getElementById('loader').classList.add("is-hidden");
      });

      if (ko.utils.unwrapObservable(value)) {
        $(element).modal('show');
          // this is to focus input field inside dialog
        } else {
          $(element).modal('hide');
        }
      }
  };

module.exports = PokedexManager;