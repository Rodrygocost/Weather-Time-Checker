// data and DOM -------------

let ApiKey = "5c1743ecdbd81bf58b166051e223741f";

const main_div = document.getElementById("main");
const name_input = document.getElementById("city_name");
const state_input = document.getElementById("state_code");
const search_city_btn = document.getElementById("search_city_btn");
const another_city_btn = document.getElementById("search_another_city_btn");
const card_div = document.getElementById("card");
const degrees = document.getElementById("degrees");
const city_name_resultpage = document.getElementById("city_name_resultpage");
const flag_img = document.getElementById("country_showed_flag");
const un_hide_div = document.getElementById("to_show_all_data");
const un_hide_timer_div = document.getElementById("time_showed");
const wheater_moisture = document.getElementById("wheater_moisture");
const weather_wind = document.getElementById("weather_wind");
const wheater_state = document.getElementById("wheater_state");
const wheater_img = document.getElementById("wheater_img");
const loading_div = document.getElementById("loading_div");

// error checker

let error_finder = false;
let data_colected = false;

// error shower

function error_detected() {
  error_finder = true;
  const error_message = document.createElement("p");
  error_message.innerText =
    "Opah... Ocorreu um pequeno problema na busca pelos dados... verifique se tudo foi digitado corretamente e tente novamente!";
  error_message.id = "error-message";
  const error_exists = document.getElementById("error-message");

  if (!error_exists) {
    main_div.appendChild(error_message);
  }

  if ((un_hide_div.classList = "showed")) {
    un_hide_div.classList.replace("showed", "hide");
    un_hide_timer_div.classList.replace("showed", "hide");

    data_colected = false;
  }
  return "error";
}

// functions -----

// to get city cords

currentCords = {};
all_data = {};

currentWheater = {};

function GetCordinates(city, state) {
  const cordApiAdresss = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},&appid=${ApiKey}`;
  const result = fetch(cordApiAdresss)
    .then((res) => res.json())
    .then((data) => {
      currentCords = data;
      return data;
    })
    .catch((error) => {
      error_detected();
    });

  return result;
}

// to get city wheater

function GetWeather(lat, lon) {
  const whatherApiadress = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=pt_br&units=metric&appid=${ApiKey}`;
  return fetch(whatherApiadress)
    .then((res) => res.json())
    .then((data) => {
      currentWheater = data;
      return data;
    })
    .catch((error) => {
      error_detected();
    });
}

// to get current time

function Set_timer() {
  const timer_hours = document.getElementById("timer_hours");
  const timer_minutes = document.getElementById("timer_minutes");
  const timer_seconds = document.getElementById("timer_seconds");

  const my_timezone = currentWheater.timezone / 3600;

  let dataAtual = new Date();
  let horarioLocal = dataAtual.toLocaleTimeString("pt-BR", {
    timeZone: "UTC",
  });

  if (error_finder) {
    console.log("timer calc error...");
  } else if (parseFloat(horarioLocal.slice(0, 2)) + my_timezone > 23) {
    const final_calc = parseFloat(horarioLocal.slice(0, 2)) + my_timezone;

    timer_hours.innerText = final_calc - 24;
    timer_minutes.innerText = horarioLocal.slice(3, 5);
    timer_seconds.innerText = horarioLocal.slice(6, 8);
  } else if (parseFloat(horarioLocal.slice(0, 2)) + my_timezone <= 23) {
    timer_hours.innerText = parseFloat(horarioLocal.slice(0, 2)) + my_timezone;
    timer_minutes.innerText = horarioLocal.slice(3, 5);
    timer_seconds.innerText = horarioLocal.slice(6, 8);
  }

  return "timer set";
}
// get city lat and lon (cords)

search_city_btn.addEventListener("click", async (ev) => {
  ev.preventDefault();

  // input checker

  if (name_input.value === "" || typeof name_input.value === "number") {
    error_detected();
  } else if (typeof state_input.value === "number") {
    error_detected();
  }
  // api call
  currentCords = await GetCordinates(name_input.value, state_input.value);
  all_data = currentCords[0];

  // console.log(currentCords);
  // console.log(all_data.name);
  // console.log(all_data.lat);
  // console.log(all_data.lon);
  // console.log(all_data.country);

  // get full wheater (all data in the city)

  currentWheater = await GetWeather(all_data.lat, all_data.lon);
  // console.log(currentWheater);
  // console.log(currentWheater.main.temp);

  // get and sett current time

  // set itens in card

  if (currentWheater.main.temp.toString().slice(0, 2) < 0) {
    degrees.textContent = currentWheater.main.temp.toString().slice(0, 2) + "°";
  } else if (currentWheater.main.temp.toString().slice(0, 2) < 10) {
    degrees.textContent = currentWheater.main.temp.toString().slice(0, 2) + "°";
  } else if (currentWheater.main.temp.toString().slice(0, 2) >= 10) {
    degrees.textContent = currentWheater.main.temp.toString().slice(0, 2) + "°";
  }

  city_name_resultpage.textContent = all_data.name;
  flag_img.setAttribute(
    "src",
    `https://flagsapi.com/${all_data.country}/flat/64.png`
  );

  wheater_moisture.textContent =
    "💧" + "ﾠ" + currentWheater.main.humidity + " %";
  weather_wind.textContent = "🌫️" + " " + currentWheater.wind.speed + " km/h";
  wheater_state.textContent = currentWheater.weather[0].description;
  wheater_img.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${currentWheater.weather[0].icon}.png`
  );

  // to start timer function

  data_colected = true;

  // showing the div with all data

  if (!error_finder) {
    error_child = document.getElementById("error-message");
    if (error_child) {
      main_div.removeChild(error_child);
    }
    un_hide_div.classList.replace("hide", "showed");
    un_hide_timer_div.classList.replace("hide", "showed");

    setInterval(function Set_timer() {
      const timer_hours = document.getElementById("timer_hours");
      const timer_minutes = document.getElementById("timer_minutes");
      const timer_seconds = document.getElementById("timer_seconds");

      const my_timezone = currentWheater.timezone / 3600;

      let dataAtual = new Date();
      let horarioLocal = dataAtual.toLocaleTimeString("pt-BR", {
        timeZone: "UTC",
      });

      if (error_finder) {
        console.log("timer calc error...");
      } else if (parseFloat(horarioLocal.slice(0, 2)) + my_timezone > 23) {
        const final_calc = parseFloat(horarioLocal.slice(0, 2)) + my_timezone;

        timer_hours.innerText = "0" + (final_calc - 24);
        timer_minutes.innerText = horarioLocal.slice(3, 5);
        timer_seconds.innerText = horarioLocal.slice(6, 8);
      } else if (parseFloat(horarioLocal.slice(0, 2)) + my_timezone <= 23) {
        timer_hours.innerText =
          parseFloat(horarioLocal.slice(0, 2)) + my_timezone;
        timer_minutes.innerText = horarioLocal.slice(3, 5);
        timer_seconds.innerText = horarioLocal.slice(6, 8);
      }

      return "timer set";
    });
  } else {
    error_finder = false;
  }
});
