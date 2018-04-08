let access_token;
let tracks_displayed = false;
let artists_displayed = false;
let limit = '20';
let time_range = 'short_term';

function authorize() {

  /* adds an event listener to the button and takes page to created URL */
  document.getElementById('login-button').addEventListener('click', function() {
    let client_id = '698842fbb3c04667be310ea4326af018';
    let redirect_uri = 'https://will-hodge.github.io/top-tunes/';
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

function initialize() {
  $('#timeForm input').on('change', function() {
     time_range = $('input[name=time]:checked', '#timeForm').val();
     refresh();
  });
  $('#numResponses').on('change', function() {
     limit = $('#numResponses').val().toString();
     $('#number').html("Number of results: " + limit);
     refresh();
  });
}

function refresh() {
  if (tracks_displayed) {
    getTopTracks();
  }
  else if (artists_displayed) {
    getTopArtists();
  }
}

function getTopArtists() {
  if(access_token){
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/artists',
      data: {
        limit: limit,
        time_range: time_range,
      },
      headers: {
        'Authorization': 'Bearer ' + access_token,
      },
      success: function(response) {
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
  else {
    alert('Please log in to Spotify');
  }
}

function getTopTracks(){
  if(access_token){
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/tracks',
      data: {
        limit: limit,
        time_range: time_range,
      },
      headers: {
        'Authorization': 'Bearer ' + access_token,
      },
      success: function(response) {
        $('#results').empty();
        for (let i = 0; i < response.items.length; i++) {
          $('#results').append('<div class="track"><img src=' + response.items[i].album.images[0].url + '><h4>' + (i+1) + '. ' + response.items[i].name +' <br>' + response.items[i].artists[0].name + ' </h4></div>');
        }
        tracks_displayed = true;
        artists_displayed = false;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Unable to authorize through Spotify Web API (Error ' + jqXHR.status + ')');
      },
    });
  }
  else {
    alert('Please log in to Spotify');
  }
}


$(document).ready(function() {
  authorize();
  initialize();
  access_token = getHashValue('access_token');
  if (access_token){
    $('#login').addClass("disabled");
    $('#login-button').addClass("disabled");
    $('#button-segment').removeClass("disabled");
    $('#timeForm').removeClass("disabled");
    $('#numForm').removeClass("disabled");
  }
  else {
    $('#button-segment').addClass("disabled");
    $('#timeForm').addClass("disabled");
    $('#numForm').addClass("disabled");
  }
});
