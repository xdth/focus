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
  console.log(appuser);

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
 * Clocl
 */



/**
 * Run
 */
function run() {
  data = dataGet();
  
  if (data) {
    app = data;
  }

  console.log(app);
  
  
  Appuser();
  Search();
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
