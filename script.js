//function to fetch data from open weather map api
async function getWeather(location) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=eda2edbbce145b7aca513699a4c99b26`;
  let response;
  let json;
  try {
    response = await fetch(url).then(function (outcome) {
      if (outcome.ok) {
        return outcome;
      } else {
        throw new Error();
      }
    });
    json = await response.json();
  } catch (e) {
    return;
  }
  return json;
}

//function to process JSON for output
async function processJson(input) {
  if (!input) {
    return;
  }
  let outputJson = {};
  let output = await input;

  outputJson.main = output.main;
  outputJson.weather = output.weather[0].main;
  outputJson.description = output.weather[0].description;

  return outputJson;
}

//getting all the HTML elements that need to be manipulated
const place = document.querySelector("input");
const submit = document.querySelector("button");
const weatherName = document.querySelector("#weather");
const info = document.querySelector("#info");
const temp = document.querySelector("#temp");
const weatherImage = document.createElement("img");
const tempWithPic = document.querySelector(".temp");
const locationTitle = document.getElementById("locationTitle");

let weatherPath;

//on click event gets and displays weather information
submit.addEventListener("click", async (e) => {
  e.preventDefault();
  let weather;
  let inputJson;
  //Error handling for if a non existing location is entered
  try {
    inputJson = await getWeather(place.value);
    weather = await processJson(inputJson);
    if (!weather) {
      throw new Error();
    }
  } catch (e) {
    locationTitle.textContent = place.value + " not found!";
    weatherName.textContent = "";
    info.textContent = "";
    temp.textContent = "";
    if ([...tempWithPic.children].includes(weatherImage)) {
      tempWithPic.removeChild(weatherImage);
    }
    weatherImage.src = "";
    return;
  }
  weatherPath = weather.weather;
  locationTitle.textContent = place.value;
  weatherName.textContent = weather.weather;
  info.textContent = weather.description;
  temp.textContent = weather.main.temp + "°C";
  if (![...tempWithPic.children].includes(weatherImage)) {
    tempWithPic.appendChild(weatherImage);
  }
  if (
    !["Snow", "Clouds", "Thunderstorm", "Drizzle", "Rain", "Clear"].includes(
      weatherPath
    )
  ) {
    weatherPath = "Mist";
  }
  weatherImage.src = `./assets/${weatherPath}.png`;
});
