/**
 * Todo:
 *  Cache API response in localStorage for 1h
 */

// app object 
let app = {
  name: '',
  search: {
    enabled: true,
    engine: 'google',
  },
  weather: {
    enabled: true,
    city: 'Brussels',
    unit: 'metric',
    temp: null,
    main: null,
    description: null,
    updated: null,
  },
  greeting: {
    enabled: true,
  },
  time: {
    enabled: true,
    format: 12,
  },
  date: {
    enabled: true,
  },
  todo: {
    enabled: true,
  }
}

/**
 * Data storage functions
 */

function dataSave() {
  localStorage.setItem('dthFocus', JSON.stringify(app));
}

function dataGet() {
  data = JSON.parse(localStorage.getItem('dthFocus'));
  return data;
}

function dataDelete() {
  localStorage.removeItem('dthFocus');
  return;
}


/**
 * Utils
 */

function toggleSettings() {
  var settings = document.getElementById("settings");

  if (settings.style.display !== "block") {
    settings.style.display = "block";
    settings.style.background = "rgba(0, 0, 0, 0.5)";
  } else {
    settings.style.display = "none";
    settings.style.background = "none";
  }

  document.getElementById("menu-icon").classList.toggle("change");
} 

function resetApp() {
  confirm('This will reset the app to the default values. Continue?');
  dataDelete();
  location.reload();
}

/**
 * appuser
 */

var appuser = document.getElementById("appuser");
appuser.addEventListener('keypress', handleAppuser);
appuser.addEventListener('blur', handleAppuser);

function handleAppuser(e) {
  if (e.type === 'keypress') {
    // If user presses Enter
    if (e.which == 13 || e.keyCode == 13) {
      app.name = e.target.innerText;
      dataSave();
      appuser.blur();
    }
  } else {
    app.name = e.target.innerText;
    dataSave();
  }
}

function Appuser() {
  appuser.insertAdjacentHTML('beforeend', app.name);

  if(app.name == '' || app.name == null) {
    appuser.focus();
  }
}


/**
 * Search
 */

var settingsSearchEnabled = document.getElementById("settings-search-enabled");
var settingsSearchDisabled = document.getElementById("settings-search-disabled");
var settingsSearchDuckDuckGo = document.getElementById("settings-search-duckduckgo");
var settingsSearchGoogle = document.getElementById("settings-search-google");
var settingsSearchYoutube = document.getElementById("settings-search-youtube");

var search = document.getElementById("search");
search.addEventListener('keypress', handleSearch);
search.addEventListener('blur', handleSearch);

function handleSearch(e) {
  if (e.type === 'keypress') {
    // If user presses Enter
    if (e.which == 13 || e.keyCode == 13) {
      switch (app.search.engine) {
        case 'duckduckgo':
          window.location.href = `https://duckduckgo.com/?q=${e.target.innerText}`;
          break;
        case 'google':
          window.location.href = `https://www.google.com/search?q=${e.target.innerText}`;
          break;
        case 'youtube':
          window.location.href = `https://www.youtube.com/results?search_query=${e.target.innerText}`;
          break;
      }

      search.blur();
    }
  } 
}

function chooseSearchEnabled() {
  if(app.search.enabled) {
    settingsSearchEnabled.classList.add('settings-item-selected');
    settingsSearchDisabled.classList.remove('settings-item-selected');
    search.style.display = "block";
  } else {
    settingsSearchDisabled.classList.add('settings-item-selected');
    settingsSearchEnabled.classList.remove('settings-item-selected');
    search.style.display = "none";
  }
}

function enableSearch(value) {
  app.search.enabled = value;
  dataSave();
  chooseSearchEnabled();
}

function chooseSearchEngine() {
  switch (app.search.engine) {
    case 'duckduckgo':
      settingsSearchDuckDuckGo.classList.add('settings-item-selected');
      settingsSearchGoogle.classList.remove('settings-item-selected');
      settingsSearchYoutube.classList.remove('settings-item-selected');
      search.setAttribute("aria-placeholder", "Search DuckDuckGo");
      break;

    case 'google':
      settingsSearchDuckDuckGo.classList.remove('settings-item-selected');
      settingsSearchGoogle.classList.add('settings-item-selected');
      settingsSearchYoutube.classList.remove('settings-item-selected');
      search.setAttribute("aria-placeholder", "Search Google");
      break;

    case 'youtube':
      settingsSearchDuckDuckGo.classList.remove('settings-item-selected');
      settingsSearchGoogle.classList.remove('settings-item-selected');
      settingsSearchYoutube.classList.add('settings-item-selected');
      search.setAttribute("aria-placeholder", "Search Youtube");
      break;
  }
}

function searchEngine(engine) {
  app.search.engine = engine;
  dataSave();
  chooseSearchEngine();
}

function Search() {
  chooseSearchEnabled();
  chooseSearchEngine();
}


/**
 * Weather
 */

var settingsWeatherEnabled = document.getElementById("settings-weather-enabled");
var settingsWeatherDisabled = document.getElementById("settings-weather-disabled");
var weather = document.getElementById("weather");

var settingsWeatherMetric = document.getElementById("settings-weather-metric");
var settingsWeatherImperial = document.getElementById("settings-weather-imperial");


// var search = document.getElementById("city");
// city.addEventListener('keypress', handleCity);
// city.addEventListener('blur', handleCity);

function handleCity(e) {
  if (e.type === 'keypress' || e.type === 'blur') {
    // If user presses Enter
    if (e.which == 13 || e.keyCode == 13) {
      app.weather.city = e.target.value;
      dataSave();
      getWeatherByCity();      
      city.blur();
    }
  } 
}


async function getWeatherByCity() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${app.weather.city}&units=${app.weather.unit}&lang=en&appid=${config.apiKey}`
    );

    const data = await response.json();

    app.weather.city = data.name;
    app.weather.temp = data.main.temp;
    app.weather.main = data.weather[0].main;
    app.weather.description = data.weather[0].description;
    app.weather.updated = Date.now();
    dataSave();

    renderWeather();
    city.value = app.weather.city;

  } catch(err) {
    throw new Error("The weather service is temporarily unavailable. Please try later.");
  }  
}

function chooseWeatherEnabled() {
  if(app.weather.enabled) {
    settingsWeatherEnabled.classList.add('settings-item-selected');
    settingsWeatherDisabled.classList.remove('settings-item-selected');
    weather.style.display = "block";
  } else {
    settingsWeatherDisabled.classList.add('settings-item-selected');
    settingsWeatherEnabled.classList.remove('settings-item-selected');
    weather.style.display = "none";
  }
}

function chooseWeatherUnitEnabled(){
  if(app.weather.unit === 'metric') {
    settingsWeatherMetric.classList.add('settings-item-selected');
    settingsWeatherImperial.classList.remove('settings-item-selected');
  } else {
    settingsWeatherImperial.classList.add('settings-item-selected');
    settingsWeatherMetric.classList.remove('settings-item-selected');
  }
}

function weatherUnit(unit) {
  app.weather.unit = unit;
  dataSave();
  getWeatherByCity();
  chooseWeatherUnitEnabled();
}

function enableWeather(value) {
  app.weather.enabled = value;
  dataSave();
  chooseWeatherEnabled();
}

function renderWeather() {
  let unit = app.weather.unit === 'metric' ? 'C°' : 'F°';
  weather.innerHTML = `${app.weather.city} - ${app.weather.temp} ${unit} - ${app.weather.main} - ${app.weather.description}`;
}

function Weather() {
  chooseWeatherEnabled();
  chooseWeatherUnitEnabled();

  const timeElapsed = Date.now() - app.weather.updated;

  if (timeElapsed > 3600000 || app.weather.updated === null) {
    getWeatherByCity();
  } else {
    renderWeather();
  }
}


/**
 * Greeting
 */

var settingsGreetingEnabled = document.getElementById("settings-greeting-enabled");
var settingsGreetingDisabled = document.getElementById("settings-greeting-disabled");
var greeting = document.getElementById("greeting");

function chooseGreetingEnabled() {
  if(app.greeting.enabled) {
    settingsGreetingEnabled.classList.add('settings-item-selected');
    settingsGreetingDisabled.classList.remove('settings-item-selected');
    greeting.style.display = "block";
  } else {
    settingsGreetingDisabled.classList.add('settings-item-selected');
    settingsGreetingEnabled.classList.remove('settings-item-selected');
    greeting.style.display = "none";
  }
}

function enableGreeting(value) {
  app.greeting.enabled = value;
  dataSave();
  chooseGreetingEnabled();
}

function getGreeting() {
  timestamp = new Date();
  let hour = timestamp.getHours();

  let greeting = 'Good morning, ';

  if (hour < 12) {
    greeting = 'Good morning,'
  } else if (hour < 18) {
    greeting = 'Good afternoon,'
  } else {
    greeting = 'Good evening,'
  }

  document.querySelector('#greeting').insertAdjacentHTML('afterbegin', greeting);
}

function Greeting() {
  getGreeting();
  chooseGreetingEnabled();
}


/**
 * Time
 */

var settingsTimeEnabled = document.getElementById("settings-time-enabled");
var settingsTimeDisabled = document.getElementById("settings-time-disabled");
var time = document.getElementById("time");
var settingsTime12 = document.getElementById("settings-time-12");
var settingsTime24 = document.getElementById("settings-time-24");

const getDateTime = () => {
  timestamp = new Date();
  let weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let weekDay = weekDayNames[timestamp.getDay()];
  let day = timestamp.getDate();
  let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let month = monthNames[timestamp.getMonth()];
  let year = timestamp.getFullYear();
  let hour = timestamp.getHours();
  let minutes = timestamp.getMinutes();
  let seconds = timestamp.getSeconds();

  const addZero = (number) => {
    if (number <= 9) {
      number = '0' + number;
    }
    return number;
  }

  let amPm = '';
  if (app.time.format === 12) {
    amPm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
  }

  document.querySelector('#time').innerHTML = `${hour}:${addZero(minutes)}:${addZero(seconds)} ${amPm}`;
  document.querySelector('#date').innerHTML = `${weekDay}, ${month} ${day}, ${year}.`;

  setTimeout(getDateTime, 1000);
};

function chooseTimeEnabled() {
  if(app.time.enabled) {
    settingsTimeEnabled.classList.add('settings-item-selected');
    settingsTimeDisabled.classList.remove('settings-item-selected');
    time.style.display = "block";
  } else {
    settingsTimeDisabled.classList.add('settings-item-selected');
    settingsTimeEnabled.classList.remove('settings-item-selected');
    time.style.display = "none";
  }
}

function enableTime(value) {
  app.time.enabled = value;
  dataSave();
  chooseTimeEnabled();
}

function chooseTimeFormat() {
  if(app.time.format === 12) {
    settingsTime12.classList.add('settings-item-selected');
    settingsTime24.classList.remove('settings-item-selected');
  } else {
    settingsTime24.classList.add('settings-item-selected');
    settingsTime12.classList.remove('settings-item-selected');
  }
}

function timeFormat(value) {
  app.time.format = value;
  dataSave();
  chooseTimeFormat();
}

function CurrentTime() {
  getDateTime();
  chooseTimeEnabled();
  chooseTimeFormat();
}


/**
 * Date
 */

var settingsDateEnabled = document.getElementById("settings-date-enabled");
var settingsDateDisabled = document.getElementById("settings-date-disabled");
var date = document.getElementById("date");

function chooseDateEnabled() {
  if(app.date.enabled) {
    settingsDateEnabled.classList.add('settings-item-selected');
    settingsDateDisabled.classList.remove('settings-item-selected');
    date.style.display = "block";
  } else {
    settingsDateDisabled.classList.add('settings-item-selected');
    settingsDateEnabled.classList.remove('settings-item-selected');
    date.style.display = "none";
  }
}

function enableDate(value) {
  app.date.enabled = value;
  dataSave();
  chooseDateEnabled();
}

function CurrentDate() {
  chooseDateEnabled();
}


/**
 * Run
 */

function run() {
  data = dataGet();
  
  if (data) {
    app = data;
  }
  
  Appuser();
  Search();
  Weather();
  Greeting();
  CurrentTime();
  CurrentDate();

  console.log();
}

run();