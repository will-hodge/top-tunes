let access_token;
let tracks_displayed = false;
let artists_displayed = false;
let limit = '20';
let time_range = 'short_term';

/* adds event listener to login button and authenticates */
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
     time_range = $('input[name=time]:checked', '#timeForm').val();
     refresh();
  });
  let slider = document.getElementById("numResponses");
  slider.oninput = function() {
    limit = $('#numResponses').val().toString();
    $('#number').html("Number of results: " + limit);
  }

  $('#numResponses').on('change', function() {
   refresh();
});
}

/* refreshes display according to updated controls */
function refresh() {
  if (tracks_displayed) {
    getTopTracks();
  }
  else if (artists_displayed) {
    getTopArtists();
  }
}

/* gets the user's top artists */
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
          $('#results').append('<div class="artist"><a href="' + response.items[i].external_urls.spotify + '"target="_blank"><img src=' + response.items[i].images[1].url + '></a><h4>' + (i+1) + '. ' + response.items[i].name +'</h4></div>');
        }
        artists_displayed = true;
        tracks_displayed = false;
        if (isMobile.any) {
          $('html, body').animate({
            scrollTop: $("#results").offset().top
          }, 500);
        }
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

/* gets the user's top tracks */
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
          $('#results').append('<div class="track"><a href="' + response.items[i].external_urls.spotify + '" target="_blank"><img src=' + response.items[i].album.images[1].url + '></a><h4>' + (i+1) + '. ' + response.items[i].name +' <br>' + response.items[i].artists[0].name + ' </h4></div>');
        }
        tracks_displayed = true;
        artists_displayed = false;
        if (isMobile.any) {
          $('html, body').animate({
            scrollTop: $("#results").offset().top
          }, 500);
        }
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

  /* enables or disables controls based on authentication */
  if (access_token){
    $('#login').css('display', 'none');
    $('#button-segment').removeClass("disabled");
    $('#timeForm').removeClass("disabled");
    $('#numForm').removeClass("disabled");
  }
  else {
    $('#button-segment').addClass("disabled");
    $('#track-button').addClass("disabled");
    $('#artist-button').addClass("disabled");
    $('#timeForm').addClass("disabled");
    $('#numForm').addClass("disabled");
  }
});
