function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('autocomplete')),
                {types: ['geocode']});
                autocomplete.addListener('place_changed', fillInAddress);
}

var placeSearch, autocomplete;

function fillInAddress() {
        // Get the place details from the autocomplete object.
        place = autocomplete.getPlace();
        console.log(place);
        console.log(place.geometry.location.lat());
        console.log(place.geometry.location.lng());
}
function getGeolcation() {
        return geolocation;
}
function geolocate() {
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                        geolocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                        };
                        initAutocomplete();
                        var circle = new google.maps.Circle({
                                center: geolocation,
                                radius: position.coords.accuracy
                        });
                        autocomplete.setBounds(circle.getBounds());
                });
        }
}

// Get the modal
var modal = document.getElementById('myModal');
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
$(".close").click(function() {
        modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
$(window).click(function(event) {
        if (event.target == modal) {
                modal.style.display = "none";
        }
});

$(function() {
        $(".button").click(function() {
                // validate and process form here
                $("#lat").val(place.geometry.location.lat());
                console.log("validating");
                $("#lng").val(place.geometry.location.lng());
                var d = $("#test").val();
                var b = d.split(/\D+/);
                day = new Date(b[0], --b[1], b[2], b[3], b[4], b[5]||0, b[6]||0);
                $("#beginning").val(day);
        });
});

function handleSend(){
        var request = new XMLHttpRequest();
        request.open("POST", "https://hidden-plains-61862.herokuapp.com/sendFood", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        params = "event="+$("#event").val() + "&food="+ $("#food").val() + "&lat=" + $("#lat").val() + "&lng=" +$("#lng").val() + "&beginning=" +$("#beginning").val() +  "&expiration=" + $("#expiration").val();
        var res = encodeURI(params);
        console.log("sending stuff");
        request.send(res);
        document.getElementById('myEvent').style.display='none'

        console.log(res);
}
