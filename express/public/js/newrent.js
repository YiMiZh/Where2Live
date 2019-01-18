

$(".input a").on("click", function(){
    var id = $(this).attr("id");
    if(id == 2){
        $("#submitsuc").css("display","block");
        $("#projectinfo").css("display","none");
    }
    else{
        $("#submitsuc").css("display","none");
        $("#projectinfo").css("display","block");
    }
});
function animationHover(element, animation){
    element = $(element);
    element.hover(
        function() {
            element.addClass('animated ' + animation);
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);
        }
    );
};
animationHover("input[type=button]", "shake");

// var address = "40 St George St, Toronto";

var address = document.getElementById("postcode").value
function getPostcode(){
    if (address !== document.getElementById("postcode").value) {
        address = document.getElementById("postcode").value;
        try{initMap()}
        catch {}
        console.log("change")
    }
    setTimeout(getPostcode, 1000);
};


window.onload = function(){
    getPostcode();
}


var geocoder;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {lat: 43.6596426, lng: -79.3976676}
    });
    geocoder = new google.maps.Geocoder();
    codeAddress(geocoder, map);
}

function codeAddress(geocoder, map) {
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            // alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}