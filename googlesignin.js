// <!DOCTYPE html>
//
// <html>
//
// <head>
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
// <script src="https://apis.google.com/js/platform.js" async defer></script>
// <meta name="google-signin-client_id" content="212274986528-riqq6pe1kerhtlhvb5gtra06slf6f8ol.apps.googleusercontent.com">
//
// <script>
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var response = googleUser.getAuthResponse();
  console.log(response.expires_at);
  var x = document.getElementById("signin");
      x.style.display = "none";
  var out = document.getElementById("userinfo");
      out.style.display = "block";
  $("#user").html(profile.getName());
}

function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
                console.log('User signed out.');
        });
        var x = document.getElementById("signin");
        x.style.display = "block";
        var out = document.getElementById("userinfo");
        out.style.display = "none";
}

//</script>

// </head>
// <body>
// <div id = "userinfo" class = "usermenu" style = "display: none">
//         <p id = "user"></p>
//         <button id = 'signout' onclick='signOut()'>Sign Out</button>
// </div>
// <div id = 'signin' class="g-signin2" data-onsuccess="onSignIn"></div>
//
// <button id ="signout" onclick="signOut();">Sign out</button>
// </body>
// </html>
