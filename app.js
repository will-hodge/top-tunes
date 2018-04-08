let access_token;
let songs_retrieved = false;
let artists_retrieved = false;

function initialize() {

  /* adds an event listener to the button and takes page to created URL */
  document.getElementById('login-button').addEventListener('click', function() {
    let client_id = '698842fbb3c04667be310ea4326af018';
    let redirect_uri = 'http://127.0.0.1:3000';
    let scopes = 'user-top-read';
    /* creates authorization URL */
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scopes);
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
        'Authorization': 'Bearer ' + access_token,
      },
      success: function(response) {
        if (artists_retrieved) {
          return;
        }
        for (let i = 0; i < response.items.length; i++) {
          console.log(response.items[i]);
          $('#results').append('<img src=' + response.items[i].images[0].url + '>');
        }
        artists_retrieved = true;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Unable to authorize through Spotify Web API (Error ' + jqXHR.status + ')');
      },
    });
  }
}

function getTopSongs(){
  if(access_token){
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/songs',
      headers: {
        'Authorization': 'Bearer ' + access_token,
      },
      success: function(response) {
        if (artists_retrieved) {
          return;
        }
        for (let i = 0; i < response.items.length; i++) {
          console.log(response.items[i]);
          $('#results').append('<img src=' + response.items[i].images[0].url + '>');
        }
        artists_retrieved = true;
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
    // add disabled class to login button
  }
});

function displaySong(uri) {
  $('#song-display').html("<iframe src=\"https://open.spotify.com/embed?uri=" + uri + "\" frameborder=\"0\" allowtransparency=\"true\"></iframe>");
}
