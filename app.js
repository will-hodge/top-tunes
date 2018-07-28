let access_token = null;;
let user_id = null;
let tracks_displayed = false;
let artists_displayed = false;
let limit = '20';
let time_range = 'short_term';
let time_range_display = 'last 4 weeks';
let playlist_uris = [];
let playlist_id = null;
let playlist_url = null;

function authorize() {
  let client_id = '698842fbb3c04667be310ea4326af018';
  let redirect_uri = 'https://will-hodge.github.io/top-tunes/';
  let scopes = 'user-top-read playlist-modify-public';

  /* creates authorization URL */
  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scopes);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

  window.location = url;
}

/* gets access token from URL */
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

/* adds event listeners to controls */
function initialize() {
  $('#timeForm input').on('change', function() {
    updateRange();
    refresh();
  });
  let slider = document.getElementById("numResponses");
  slider.oninput = function() {
    limit = $('#numResponses').val().toString();
    $('#number').html("Number of results: " + limit);
  }

  $('#numResponses').on('change', refresh);
}

function updateRange() {
  time_range = $('input[name=time]:checked', '#timeForm').val();
  switch (time_range) {
    case 'short_term':
      time_range_display = 'last 4 weeks';
      break;
    case 'medium_term':
      time_range_display = 'last 6 months';
      break;
    case 'long_term':
      time_range_display = 'all time';
  }
}

/* refreshes display according to updated controls */
function refresh() {
  if (tracks_displayed) {
    getTopTracks();
  } else if (artists_displayed) {
    getTopArtists();
  }
}

function checkWidth() {
  if ($(window).width() < 1200) {
    $('html, body').animate({
      scrollTop: $("#results").offset().top
    }, 500);
  }
}

function getUserId() {
  if (access_token) {
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
         'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        user_id = response.id;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        ifError(jqXHR.status);
      },
    });
  } else {
    alert('Please log in to Spotify.');
  }
}

/* gets the user's top artists */
function getTopArtists() {
  $('#artist-button').addClass("loading");
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
        $('#artist-button').removeClass("loading");
        $('#results').empty();
        $('#results-header').html('<h2>Your Top Artists</h2>');
        response.items.map((item, i) => {
          let name = item.name;
          let url = item.external_urls.spotify;
          let image = item.images[1].url;
          $('#results').append('<div class="column wide artist item"><a href="' + url + '"target="_blank"><img src=' + image + '></a><h4 class="title">' + (i+1) + '. ' + name +'</h4></div>');
        });

        artists_displayed = true;
        tracks_displayed = false;
        checkWidth();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        ifError(jqXHR.status);
      },
    });
  } else {
    alert('Please log in to Spotify.');
  }
}

/* gets the user's top tracks */
function getTopTracks(){
  $('#track-button').addClass("loading");
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
        $('#track-button').removeClass("loading");
        playlist_uris = [];
        $('#results').empty();
        $('#results-header').html('<h2>Your Top Tracks</h2><button class="ui green button" id="build-playlist-button" onclick="buildPlaylist()">Build playlist</button>');
        response.items.map((item, i) => {
          playlist_uris.push(item.uri);
          let trackName = item.name;
          let artistName = item.artists[0].name;
          let url = item.external_urls.spotify;
          let image = item.album.images[1].url;
          $('#results').append('<div class="column wide track item"><a href="' + url + '" target="_blank"><img src=' + image + '></a><h4>' + (i+1) + '. ' + trackName +' <br>' + artistName + ' </h4></div>');
        });
        tracks_displayed = true;
        artists_displayed = false;
        checkWidth();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        ifError(jqXHR.status);
      },
    });
  } else {
    alert('Please log in to Spotify.');
  }
}


/* builds playlist of top songs */
function buildPlaylist(){
  if(access_token){
    $.ajax({
      url: 'https://api.spotify.com/v1/users/'+ encodeURIComponent(user_id) + '/playlists',
      method: 'POST',
      data: JSON.stringify({
        name: 'Top Tracks - ' + time_range_display,
        description: 'will-hodge.github.io/top-tunes'
      }),
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
      success: function(response) {
        playlist_id = response.id;
        playlist_url = response.external_urls.spotify;
        populatePlaylist();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        ifError(jqXHR.status);
      },
    });
  } else {
    alert('Please log in to Spotify.');
  }
}

function populatePlaylist() {
  $.ajax({
    url: 'https://api.spotify.com/v1/users/'+ encodeURIComponent(user_id) + '/playlists/' + encodeURIComponent(playlist_id) + '/tracks',
    method: 'POST',
    data: JSON.stringify({
      uris: playlist_uris,
    }),
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    success: function(response) {
      $('#results-header').html('<h2>Your Top Tracks</h2><h3>Playlist created!</h3>');
      let playlistLink = '<a href=' + playlist_url + ' target="_blank"><button class="ui green button" id="playlist-button">Go to playlist</button></a>';
      $('#results-header').append(playlistLink);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      ifError(jqXHR.status);
    },
  });
}

function ifError(error) {
  retryLogin();
  disableControls();
  alert('Unable to authorize through Spotify Web API (Error ' + error + '). Please try logging in again.');
}

function enableControls() {
  $('#instructions').css('display', 'none');
  $('#login').css('display', 'none');
  $('#button-segment').removeClass("disabled");
  $('#timeForm').removeClass("disabled");
  $('#numForm').removeClass("disabled");
}

function disableControls() {
  $('#button-segment').addClass("disabled");
  $('#track-button').addClass("disabled");
  $('#build-playlist-button').addClass("disabled");
  $('#artist-button').addClass("disabled");
  $('#timeForm').addClass("disabled");
  $('#numForm').addClass("disabled");
}

function retryLogin() {
  $('#instructions').css('display', 'block');
  $('#login').css('display', 'block');
}

$(document).ready(function() {
  initialize();
  access_token = getHashValue('access_token');

  /* enables or disables controls based on authentication */
  if (access_token) {
    getUserId();
    enableControls();
  } else {
    disableControls();
  }
});
