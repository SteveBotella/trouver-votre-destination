// VARIABLES
const apiKey = "56b54737cee432fa16e84110b8e24e90";

const map = L.map('mapid').setView([46.71109, 1.7191036], 1);

function searchCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if(data.cod != 404) {
        const {
          coord: {
            lon,
            lat
          },
          name,
          weather,
          main: {
            feels_like,
            humidity,
            pressure,
            temp,
            temp_max,
            temp_min
          }
        } = data;
        map.setView([lat, lon], 10);
        $('#titleWeather').html(`La météo sur ${name}`);
        $('#descriptionWeather').html(weather.map(o => o.description).toString());
        $('#temperature').html(`${temp}°C`);
        $('#temperatureFeel').html(`${feels_like}°C`);
        $('#humidity').html(`${humidity}%`);
        $('#pressure').html(`${pressure}Pa`);
        $('#tempMax').html(`${temp_max}°C`);
        $('#tempMin').html(`${temp_min}°C`);
      }
    })
    .catch(error => console.log(error));
}

function searchForSuggestion(city) {
  fetch(`https://geo.api.gouv.fr/communes?nom=${city}&fields=departement&boost=population&limit=5`)
  .then(res => res.json())
  .then(data => {
    const section = document.querySelector('#suggestions');
    section.innerHTML = '';
    if (data) {
      data.forEach(o => generateSuggestion(o));
    }
  })
  .catch(error => console.log(error));
}

function generateSuggestion(data) {
  const {
    nom,
    code,
    departement: {
      code: codeDepartement,
      nom: nomDepartement
    }
  } = data;

  const card = document.createElement('div');
  const ville = document.createElement('span');
  const departement = document.createElement('span');
  ville.innerHTML = `${nom} (${code})`;
  departement.innerHTML = `${nomDepartement || '??'} (${codeDepartement || '??'})`;
  card.setAttribute('class', 'flex flex-col min-w-1/6 h-16 px-2 items-center justify-center cursor-pointer');
  departement.setAttribute('class', 'text-gray-400 text-sm')
  card.appendChild(ville);
  card.appendChild(departement);
  card.addEventListener('click', () => {
    $('#input-search').val(nom);
    searchCity(nom);
    searchForSuggestion(nom);
  });

  const section = document.querySelector('#suggestions');
  section.appendChild(card);
}


$("#input-search").change(function() {
  const city = this.value;
  searchCity(city);
  searchForSuggestion(city);
});


// MAP CONTROL

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicmRob3giLCJhIjoiY2tycWQycXhkMDZmNjMwbzRqMzlqb2h3NCJ9.w11nqRMKGflwuJMIJ8upTg'
}).addTo(map);