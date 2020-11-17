/**
 * Todo:
 *  Cache API response in localStorage for 1h
 * 
 * 
 */

// app object 
let app = {
  name: '',
  search: {
    enabled: true,
    engine: 'google',
  },
  time: {
    format: 12,
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
  var html = document.getElementById("body");

  if (settings.style.display !== "block") {
    settings.style.display = "block";
    html.style.background = "rgba(0, 0, 0, 0.5)";
  } else {
    settings.style.display = "none";
    html.style.background = "none";
  }

  document.getElementById("menu-icon").classList.toggle("change");
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
 * Date and time
 */


const getDateTime = () => {
  timestamp = new Date();
  // timestamp = new Date(1, 1, 1, 20, 4, 5);
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

function getGreeting() {
  timestamp = new Date();
  // timestamp = new Date(1, 1, 1, 1, 4, 5);
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

function dateTime() {
  getDateTime();
  getGreeting();
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
  dateTime();
}

run();



///////////////////////////////////////////////////

async function fetchTemperature() {
  const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/455826/');
  const data = await response.json();

  const city = data.title;
  document.querySelector('#city').insertAdjacentHTML('beforeend', city);

  const cityTime = data.time;
  document.querySelector('#time').insertAdjacentHTML('beforeend', cityTime);

  const cityWeather = data.consolidated_weather[0].the_temp;
  document.querySelector('#temperature').insertAdjacentHTML('beforeend', cityWeather);

  return data;
}

// fetchTemperature().then(data => {
//   data; // fetched movies
// });



// const navbarStatusUpdated = data.map(data => `<span class="fw-bold"> ${getDateTime(data.updated)}&nbsp;&nbsp;</span>`);
// document.querySelector('#navbar-status-updated').insertAdjacentHTML('beforeend', navbarStatusUpdated);
