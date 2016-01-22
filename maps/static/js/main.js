var map = L.map('container').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'cderwin.oop9ob0c',
            accessToken: 'pk.eyJ1IjoiY2RlcndpbiIsImEiOiJjaWpwOTh2bXUwMTN1dG9rb2g3Y2NmeWJ6In0.WZwqIUtZ4neCjXMT1YOmYw'
            }).addTo(map);
