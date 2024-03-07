const locationAPI = "https://api.geoapify.com/v1/geocode/search";
const weatherAPI = "https://api.open-meteo.com/v1/";
const apiKey = "7ff453cd9b2d4e349b1132e5b7e384cb";
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const locationEle = document.querySelector(".input-location");
const containerEle = document.querySelector(".display-weather");
const btnSubmit = document.querySelector(".btn-search");
const btnReset = document.querySelector(".btn-reset");
const displayStatus = document.querySelector(".status");
const todayDay = weekdays[new Date().getDay()];

const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getLocationData = async () => {
  try {
    const url = `${locationAPI}?text=${locationEle.value}&apiKey=${apiKey}`;
    const data = await fetchData(url);
    return {
      latitude: data.features[0].properties.lat,
      longitude: data.features[0].properties.lon,
    };
  } catch (error) {
    displayStatus.textContent = "Failed to fetch location data";
    throw error;
  }
};

const getWeatherData = async () => {
  try {
    const { latitude, longitude } = await getLocationData();
    const url = `${weatherAPI}forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&timezone=auto&forecast_days=1`;
    const weatherData = await fetchData(url);
    console.log(weatherData);
    displayStatus.classList.add("hidden");
    containerEle.insertAdjacentHTML(
      "beforeend",
      `<section class="display-date sub-cont">
        <h3 class="date-header">
          <img class="art-img" src="img\\calendar.png" alt="Day of the week" />
          Day of the Week
        </h3>
        <h4 class="date-content">${todayDay}</h4>
      </section>
      <section class="display-current sub-cont">
        <h3 class="disply-temp">
          <img class="art-img" src="img\\wind.png" alt="Temperature" />
          Temperature
        </h3>
        <h4 class="current-temp">${
          weatherData.current.temperature_2m !== undefined
            ? weatherData.current.temperature_2m
            : "No Data found"
        } ${weatherData.current_units.temperature_2m}</h4>
      </section>
      <section class="display-city sub-cont">
        <h3 class="city-head">
          <img class="art-img" src="img//city.png" alt="city" />
          City:
        </h3>
        <h4 class="city">${locationEle.value}</h4>
      </section>
      <section class="display-airPress sub-cont">
        <h3 class="air-press">
          <img class="art-img" src="img\\wind.png" alt="Air Pressure" />
          Air Pressure:
        </h3>
        <h4 class="current-temp">${
          weatherData.current.wind_speed_10m !== undefined
            ? weatherData.current.wind_speed_10m
            : "No Data found"
        } Km/h</h4>
      </section>`
    );
  } catch (error) {
    console.error(error);
  }
};

btnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (locationEle.value !== "") {
    displayStatus.classList.remove("hidden");
    displayStatus.textContent = "Loading....";
    containerEle.innerHTML = "";
    await getWeatherData();
  } else {
    displayStatus.textContent = "Please enter a city";
    alert("Please Enter a location");
  }
});

btnReset.addEventListener("click", (e) => {
  e.preventDefault();
  location.reload();
});
