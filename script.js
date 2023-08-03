const body = document.body;
let favorites = [];

initialPopulator();

function showWeather(city) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      // geocoding, getting the exact location for edge cases
      const coordinates = data.results[0].geometry.location;
      let cityName = data["results"][0]["address_components"][0]["long_name"];
      let lat = coordinates.lat;
      let long = coordinates.lng;

      fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${lat},${long}&days=1&aqi=no&alerts=no
      `)
        .then((response2) => response2.json())
        .then((data2) => {
          // advanced weather info fetched
          const temperature = Math.round(data2["current"]["temp_c"]);
          const icon = data2["current"]["condition"]["icon"];
          const humidity = data2["current"]["humidity"];
          const description = data2["current"]["condition"]["text"];
          const windSpeed = Math.floor(data2["current"]["wind_kph"]);
          const windDir = data2["current"]["wind_dir"];
          const localTime = data2["location"]["localtime"].split(" ")[1];
          const precip = data2["current"]["precip_mm"];
          const sunrise =
            data2["forecast"]["forecastday"][0]["astro"]["sunrise"];
          const sunset = data2["forecast"]["forecastday"][0]["astro"]["sunset"];
          //populator for the modal
          populator(
            cityName,
            temperature,
            icon,
            humidity,
            windSpeed,
            description,
            windDir,
            localTime,
            precip,
            sunrise,
            sunset,
            data2
          );
          // favorite functionality
          favoritesFunctionality(cityName);

          if (document.querySelector(".favorites-list") !== null) {
            document.querySelector(".favorites-list").remove();
          }
          document
            .querySelector(".card")
            .insertAdjacentHTML(
              "beforeend",
              `<div class="favorites-list">Saved locations</div>`
            );
          const favList = document.querySelector(".favorites-list");
          showFavList(favList);
        });

      fetch(
        `https://api.unsplash.com/search/photos?client_id=${unsplashApiKey}&query=${cityName}&orientation=landscape`
      )
        .then((response3) => response3.json())
        .then((data3) => {
          try {
            body.style.backgroundImage = `url("${
              data3["results"][Math.floor(Math.random() * 5)]["urls"]["full"]
            }")`;
          } catch (err) {
            body.style.backgroundImage = `url("https://images.pexels.com/photos/1287142/pexels-photo-1287142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`;
          }
        });

      document.querySelector("body > div > div.search > input").value = "";
    });
}

function populator(
  cityName,
  temperature,
  icon,
  humidity,
  windSpeed,
  description,
  windDir,
  localTime,
  precip,
  sunrise,
  sunset,
  data2
) {
  const card = document.querySelector("body > div");
  if (document.querySelector(".weather") !== null) {
    document.querySelector(".weather").remove();
  }
  if (document.querySelector(".six-hour-forecast") !== null) {
    document.querySelector(".six-hour-forecast").remove();
  }
  if (document.querySelector(".second-flex") !== null) {
    document.querySelector(".second-flex").remove();
  }

  card.insertAdjacentHTML(
    "beforeend",
    `
      <div class="weather">
          <h2 class="city">Weather in ${cityName}
            <button class="second-button"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 00-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 00-.163-.505L1.71 6.745l4.052-.576a.525.525 0 00.393-.288l1.847-3.658 1.846 3.658a.525.525 0 00.393.288l4.052.575-2.906 2.77a.564.564 0 00-.163.506l.694 3.957-3.686-1.894a.503.503 0 00-.461 0z" clip-rule="evenodd"></path></svg></button>
          </h2> 
          <h1 class="temp">${temperature}°C</h1>
          <div class="flex">
            <img src="${icon}" alt="icon" class="icon">
            <div class="description">${description}</div>
          </div>
          <div class="hour">Local hour ${localTime}</div>
          <div class="humidity">Humidity: ${humidity}% | Precipitation ≈ ${precip}mm</div>
          <div class="wind">Wind speed ${windSpeed}km/h | ${windDir}</div>
          <duv class="astro">Sunrise ${sunrise} | Sunset ${sunset}</div>
          <div class="six-hour-forecast">Forecast of the day</div>
          <div class="second-flex">
          </div>
        </div>
      </div>
    `
  );

  createHourly(data2);
  document.querySelector("body > div").style.height = "35rem";
}

function initialPopulator() {
  body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="card">
      <div class="search">
          <input type="text" class="search-bar" id="autocomplete" placeholder="Input city name . . .">
          <button><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"></path></svg></button>
      </div>
    </div>
    `
  );
  document.querySelector("body > div").style.height = "auto";
  const searchButton = document.querySelector(
    "body > div > div.search > button"
  );
  searchButton.addEventListener("click", () => {
    const input = document.querySelector("body > div > div.search > input");
    showWeather(input.value);
  });

  window.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      const input = document.querySelector("body > div > div.search > input");
      showWeather(input.value);
    }
  });
  autocomplete();
}

function autocomplete() {
  const input = document.getElementById("autocomplete");
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["(cities)"],
    fields: ["name", "geometry"],
  });
}

function createHourly(data2) {
  for (let i = 0; i < 24; i++) {
    let picUrl =
      data2["forecast"]["forecastday"][0]["hour"][i]["condition"]["icon"];
    let hourlyTemp = Math.round(
      data2["forecast"]["forecastday"][0]["hour"][i]["temp_c"]
    );
    const box = document.querySelector(".second-flex");
    box.insertAdjacentHTML(
      "beforeend",
      `
      <div class="detail-by-hour">
      <div class="hourly">${i > 9 ? i : `0${i}`}:00</div>
      <img src="${picUrl}" class="icon">
      <div class="hourly-temp">${hourlyTemp}°C</div>
      </div>
      `
    );
  }
}

function favoritesFunctionality(cityName) {
  if (favorites.some((obj) => obj.name === cityName)) {
    document.querySelector(".second-button").firstChild.style.fill = "yellow";
  } else {
    document.querySelector(".second-button").firstChild.style.fill = "white";
  }
  document.querySelector(".second-button").addEventListener("click", () => {
    if (!favorites.some((obj) => obj.name === cityName)) {
      document.querySelector(".second-button").firstChild.style.fill = "yellow";
      favorites.push({
        name: cityName,
      });

      if (document.querySelector(".favorites-list") !== null) {
        document.querySelector(".favorites-list").remove();
      }
      document
        .querySelector(".card")
        .insertAdjacentHTML(
          "beforeend",
          `<div class="favorites-list">Saved locations</div>`
        );
      const favList = document.querySelector(".favorites-list");
      showFavList(favList);
    } else {
      document.querySelector(".second-button").firstChild.style.fill = "white";
      const index = favorites.findIndex((obj) => obj.name === cityName);
      favorites.splice(index, 1);

      if (document.querySelector(".favorites-list") !== null) {
        document.querySelector(".favorites-list").remove();
      }
      document
        .querySelector(".card")
        .insertAdjacentHTML(
          "beforeend",
          `<div class="favorites-list">Saved locations</div>`
        );
      const favList = document.querySelector(".favorites-list");
      showFavList(favList);
    }
  });

  if (document.querySelector(".favorites-list") !== null) {
    document.querySelector(".favorites-list").remove();
  }
}

function showFavList(favList) {
  for (let i = 0; i < favorites.length; i++) {
    let formattedId = favorites[i].name
      .replaceAll(" ", "")
      .replaceAll(",", "")
      .replaceAll(".", "")
      .normalize();
    favList.insertAdjacentHTML(
      "beforeend",
      `
      <button class="fav-btn" id="fav${formattedId}">${favorites[i].name}</button>
      `
    );

    let selected = document.querySelector(`#fav${formattedId}`);
    selected.addEventListener("click", () => {
      showWeather(favorites[i].name);
    });
  }
}
