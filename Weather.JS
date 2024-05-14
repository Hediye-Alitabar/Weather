const api_url =
  "https://api.dastyar.io/express/weather?lat=35.67194277&lng=51.42434403";

function fetchData() {
  fetch(api_url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response was not ok!");
      }
      return response.json();
    })
    .then((data) => {
      displayData(data);
      displayTodayWeather(data);
      todayDate(data);
    })
    .catch((error) => {
      console.error("There was a problem fetching the data:", error);
    });
}

let weatherPhotos = {
  partlyCloudy: "./Images/partlyCloudy.png",
  rainDrop: "./Images/rainDrop.png",
  shower: "./Images/shower.png",
  snow: "./Images/snow.png",
  storm: "./Images/storm.png",
  Clear: "./Images/Clear.png",
};

const descToPersian = {
  clearSky: "هوای صاف",
  lightRain: "باران ملایم",
  scatteredClouds: "ابرهای پراکنده",
  fewClouds : "کمی ابری"
};

function todayDate(data) {
  const header = document.getElementById("header");
  const todayData = data.find((item) => item.dateTitle === "امروز");
  if (todayData) {
    const todayWeather = document.createElement("div");
    // const location = document.createElement("div");
    // location.textContent = 'تهران';
    // header.appendChild(location);
    // todayWeather.classList.add("today");
    const todayDate = new Date(todayData.date);
    const options = { weekday: "long", month: "long", day: "numeric" };
    todayWeather.innerHTML = `<p>${todayDate.toLocaleDateString(
      "fa-IR",
      options
    )}</p> `;
    header.appendChild(todayWeather);
  } else {
    console.error("No weather data available for today.");
  }
}

function weatherImage(weather) {
  switch (weather) {
    case "Clear":
      return weatherPhotos.Clear;
    case "Clouds":
      return weatherPhotos.partlyCloudy;
    case "Rain":
      return weatherPhotos.rainDrop;
    case "Shower":
      return weatherPhotos.shower;
    case "Snow":
      return weatherPhotos.snow;
    case "Storm":
      return weatherPhotos.storm;
    default:
      return "";
  }
}

function weatherDesc(weather) {
  switch (weather) {
    case "clear sky":
      return descToPersian.clearSky;
    case "light rain":
      return descToPersian.lightRain;
    case "scattered clouds":
      return descToPersian.scatteredClouds;
      case "few clouds":
        return descToPersian.fewClouds;
    default:
      return "";
  }
}

function toPersianNumber(number) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return number.toString().replace(/\d/g, (d) => persianDigits[d]);
}

function displayTodayWeather(data) {
  const header = document.getElementById("today");
  const todayData = data.find((item) => item.dateTitle === "امروز");
  if (todayData) {
    const todayWeather = document.createElement("div");
    todayWeather.classList.add("today-weather");

    const maxTemp = toPersianNumber(parseFloat(todayData.max).toFixed(0));
    const minTemp = toPersianNumber(parseFloat(todayData.min).toFixed(0));
    const currentTemp = toPersianNumber(
      parseFloat(todayData.current).toFixed(0)
    );

    const dateIcon = document.createElement("div");
    dateIcon.classList.add("today_icon");
    const iconUrl = weatherImage(todayData.weather.main);
    // if (iconUrl) {
    dateIcon.innerHTML = `<img src="${iconUrl}">`;
    // }
    todayWeather.appendChild(dateIcon);

    const currentTempElement = document.createElement("h2");
    currentTempElement.textContent = `${currentTemp}`;
    todayWeather.appendChild(currentTempElement);

    const dateDesc = document.createElement("div");
    dateDesc.classList.add("desc");
    const desc = weatherDesc(todayData.weather.description);
    dateDesc.innerHTML = `<p><strong>${desc}</strong></p>`;
    todayWeather.appendChild(dateDesc);

    const temp = document.createElement("div");
    temp.classList.add("temp");
    const temp_max = document.createElement("span");
    temp_max.classList.add("temp_max");
    const temp_min = document.createElement("span");
    temp_min.classList.add("temp_min");
    temp_min.textContent = `حداقل ${minTemp}°`;
    temp_max.textContent = `${maxTemp}°` + `حداکثر`;
    temp.appendChild(temp_min);
    temp.appendChild(temp_max);
    todayWeather.appendChild(temp);

    header.appendChild(todayWeather);
  } else {
    console.error("No weather data available for today.");
  }
}

function displayData(data) {
  const container = document.getElementById("weather-container");
  container.innerHTML = "";
  const otherDaysData = data.filter((item) => item.dateTitle !== "امروز");

  otherDaysData.forEach((item) => {
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");

    const dateTitle = document.createElement("span");
    dateTitle.classList.add("date-title");
    const date = new Date(item.date);
    const options = { weekday: "long" };
    dateTitle.textContent = date.toLocaleDateString("fa-IR", options);
    weatherCard.appendChild(dateTitle);

    const dateIcon = document.createElement("span");
    dateIcon.classList.add("icon");
    const iconUrl = weatherImage(item.weather.main);
    if (iconUrl) {
      dateIcon.innerHTML = `<img src="${iconUrl}">`;
    }
    weatherCard.appendChild(dateIcon);

    const maxTemp = toPersianNumber(parseFloat(item.max).toFixed(0));
    const minTemp = toPersianNumber(parseFloat(item.min).toFixed(0));
    const temp = document.createElement("div");
    temp.classList.add("temp");
    const temp_max = document.createElement("span");
    const temp_min = document.createElement("span");
    temp_min.textContent = `°${minTemp} حداقل`;
    temp_max.textContent = `°${maxTemp} حداکثر`;
    temp.appendChild(temp_min);
    temp.appendChild(temp_max);
    weatherCard.appendChild(temp);

    container.appendChild(weatherCard);
  });
}

function theme() {
  const hour = new Date().getHours();
  const body = document.body;

  if (hour >= 18 || hour < 6) {
    body.classList.add("dark-mode");
  }else {
    body.classList.add("main");
  }
}

theme();
setInterval(theme, 60 * 60 * 1000);

fetchData();
