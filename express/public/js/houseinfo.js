var address = document.querySelector('#address').attributes[1].value;
var geocoder;
console.log(address)
function initMap() {
    var map = new google.maps.Map(document.getElementById('googleMap'), {
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
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function delHome() {
    let posterid = document.getElementById('posterid').innerHTML
    let house_id = document.getElementById('house_id').innerHTML
    let form = document.getElementById('delForm')
    form.action="/delHome";
    form.method='post';
    let input_2 = document.createElement('input')
    input_2.type='hidden'
    input_2.name='posterid';
    input_2.value=posterid;    
    let input = document.createElement('input')
    input.type='hidden'
    input.name='house_id';
    input.value=house_id;
    form.appendChild(input)
    form.appendChild(input_2)
    form.submit()
}