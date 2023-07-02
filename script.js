// Functions that hit the API; can take a location and return the weather data for that location
const getLocationData = async (location) => {
  const fetched = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=bacd4120e0204e62997230841232906&q=${location}`,
    { mode: "cors" }
  );
  if (!fetched.ok) {
    throw new Error(`Error status ${fetched.status}: ${fetched.statusText}`);
  }
  return await fetched.json();
};
// Function that processes the JSON data from the API and return an object with only the required data
const getWeatherData = async (location, fn) => {
  const {
    location: { country, name },
    current: { condition, temp_f, feelslike_f, wind_mph, humidity },
  } = await fn(location);
  return {
    country,
    name,
    condition: condition.text,
    temp: temp_f,
    feels_like: feelslike_f,
    wind: wind_mph,
    humidity,
  };
};
// Populate dom with info
const populateDOM = (data) => {
  document.getElementById("condition").textContent = data.condition;
  document.getElementById("loc").textContent = `${data.name}, ${data.country}`;
  document.getElementById("temp").textContent = data.temp;
  document.getElementById(
    "feels-like"
  ).textContent = `FEELS LIKE: ${data.feels_like}`;
  document.getElementById("wind").textContent = `WIND: ${data.wind} MPH`;
  document.getElementById(
    "humidity"
  ).textContent = `HUMIDITY: ${data.humidity}%`;
  document.querySelector(".weather-details").classList.add("active");
  document.getElementById("temp").classList.add("active");
  document.getElementById("feels-like").classList.add("active");
  document.querySelector(".container").classList.add("active");
};
// User input location
document
  .getElementById("location-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const data = await getWeatherData(
        e.target.location.value,
        getLocationData
      );
      document.querySelector(".container").classList.remove("active");
      setTimeout(() => {
        populateDOM(data);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  });
// Load current location info on pg initialization
(async function () {
  const successCallback = async (position) => {
    const location = `${position.coords.latitude},${position.coords.longitude}`;
    const data = await getWeatherData(location, getLocationData);
    populateDOM(data);
  };
  const errorCallback = (error) => {
    throw new Error(error.statusText);
  };
  try {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } catch (error) {
    console.log(error);
  }
})();
