let access_token;
let tracks_displayed = false;
let artists_displayed = false;

function initialize() {

  /* adds an event listener to the button and takes page to created URL */
  document.getElementById('login-button').addEventListener('click', function() {
    let client_id = '698842fbb3c04667be310ea4326af018';
    let redirect_uri = 'https://will-hodge.github.io/projects/top-tunes';
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
        if (artists_displayed) {
          return;
        }
        $('#results').empty();
        for (let i = 0; i < response.items.length; i++) {
          console.log(response.items[i]);
          $('#results').append('<div class="artist"><img src=' + response.items[i].images[0].url + '><h4>' + (i+1) + '. ' + response.items[i].name +'</h4></div>');
        }
        artists_displayed = true;
        tracks_displayed = false;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Unable to authorize through Spotify Web API (Error ' + jqXHR.status + ')');
      },
    });
  }
}

function getTopTracks(){
  if(access_token){
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/tracks',
      headers: {
        'Authorization': 'Bearer ' + access_token,
      },
      success: function(response) {
        if (tracks_displayed) {
          return;
        }
        $('#results').empty();
        for (let i = 0; i < response.items.length; i++) {
          $('#results').append('<div class="track"><img src=' + response.items[i].album.images[0].url + '><h4>' + (i+1) + '. ' + response.items[i].name +' –<br>' + response.items[i].artists[0].name + ' </h4></div>');
        }
        tracks_displayed = true;
        artists_displayed = false;
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
