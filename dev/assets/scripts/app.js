var $ = require('jquery');

var ko = require('knockout');

var PokemonManager = function PokemonManager () {
  var self = this;

  this.pokemonDatas = ko.observable();
  this.pokemonList = ko.observableArray([]);

  

  this.bindEvents = function () {
    $("body").on('click', 'button[data-pokemon]', function(e) {
      self.fetchPokemon($(e.currentTarget).data("pokemon"));
    } )
  }
  this.bindEvents();

  this.fetchPokemon = function fetchPokemon(id) {
    $.ajax({
      url: `http://pokeapi.co/api/v1/pokemon/${id}/`,
      cache: false
    })
    .done(function( result ) {
      self.pokemonDatas(result);
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

    // var foo = list.map(function(pkmn) {
    //   fetchPokemonSprite(pkmn.idDex);
    // });
  }

  /*
    PRIVATE FUNCTIONS
    R
    I
    V
    A
    T
    E

    F
    U
    N
    C
    T
    I
    O
    N
    S
   */
  function fetchPokemonSprite(id) {
    $.ajax({
      url: `http://pokeapi.co/api/v1/sprite/${id}/`,
      cache: false
    })
    .done(function( result ) {
      var pkmnSprite = `http://pokeapi.co${result.image}`; 
      console.log(pkmnSprite);
    });
  }
}

ko.applyBindings(new PokemonManager());