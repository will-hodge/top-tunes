let access_token;

function initialize() {

  /* adds an event listener to the button and takes page to created URL */
  document.getElementById('login-button').addEventListener('click', function() {
    let client_id = '698842fbb3c04667be310ea4326af018';
    let redirect_uri = 'https://will-hodge.github.io/top-tunes/';

    /* creates authorization URL */
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

    window.location = url;
  }, false);
}

function getHashValue(key) {
    if (typeof key !== 'string') {
        key = '';
    } else {
        key = key.toLowerCase();
    }

    let keyAndHash = location.hash.match(new RegExp(key + '=([^&]*)'));
    let value = '';

    if (keyAndHash) {
        value = keyAndHash[1];
    }

    return value;
};

function getTopArtists(){
  if(access_token){
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        if (response.items.length != 0){
          for (artist in response.items) {
            $('#results').append('<div class="artist"><img src=' + artist.images[0].url + '>' + '<h3 class="ui header centered>"' + artist.name + '</h3></div>');
          }
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Unable to authorize through Spotify Web API (Error ' + jqXHR.status + ')');
      },
    });
  }
}

/* TESTING FUNCTION... NOT USED IN FINAL PRODUCTION */
function searchGenre(){
  let genre = prompt("Please enter a genre:");
  if(access_token){
    $.ajax({
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: 'genre:' + '\"' + genre + '\"',
        type: 'artist'
      },
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        if(response.artists.items.length != 0){
          console.log(response.artists.items);
          for (let i = 0; i < 5; i++){
            alert('Name [' + response.artists.items[i].name + ']' + '\n'
            + 'Popularity [' + response.artists.items[i].popularity + ']' + '\n'
            + 'Followers [' + response.artists.items[i].followers.total + ']');
          }
        }
        else {
          if (genre){
            alert("No artists found with that genre.");
          }
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Unable to authorize through Spotify Web API (Error ' + jqXHR.status + ')');
      },
    });
  }
}


$(document).ready(function() {
  initialize();
  access_token = getHashValue('access_token');
  if (access_token){
    $('#header').html("SpotAffect");
    $('.running').show();
    $('.login').hide();
    $('#active').addClass("disabled");
  }
});

function displaySong(uri) {
  $('#song-display').html("<iframe src=\"https://open.spotify.com/embed?uri=" + uri + "\" frameborder=\"0\" allowtransparency=\"true\"></iframe>");
}
