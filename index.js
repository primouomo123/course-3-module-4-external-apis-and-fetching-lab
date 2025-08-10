// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
function fetchWeatherAlerts() {
  const stateInput = document.getElementById("state-input");
  const state = stateInput.value.trim().toUpperCase();
  const errorMessage = document.getElementById("error-message");
  const alertsDisplay = document.getElementById("alerts-display");
  const loadingSpinner = document.getElementById("loading-spinner");

  // Clear previous error message and alerts
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
  alertsDisplay.innerHTML = "";

  // In case of an empty input
  if (!state) {
    errorMessage.textContent = "Please enter a state abbreviation.";
    errorMessage.classList.remove("hidden");
    return;
  }

  // Show spinner before starting fetch
  loadingSpinner.classList.remove("hidden");

  fetch(weatherApi + state)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayAlerts(data); // I call displayAlerts here. It was created in line 51
      // Clear input after successful fetch
      stateInput.value = "";
    })
    .catch((error) => {
      errorMessage.textContent = error.message;
      errorMessage.classList.remove("hidden");
      // Clear input after error as well
      stateInput.value = "";
    })
    .finally(() => {
      // Hide spinner after fetch completes (success or failure)
      loadingSpinner.classList.add("hidden");
    });
}

function displayAlerts(data) {
  const alertsDisplay = document.getElementById("alerts-display");

  // Create heading showing title and number of alerts
  const summaryMessage = document.createElement("h2");
  const alertsCount = data.features.length;
  summaryMessage.textContent = `${data.title}: ${alertsCount}`;

  const list = document.createElement("ul");

  if (alertsCount === 0) {
    const noAlerts = document.createElement("li");
    noAlerts.textContent = "No current alerts for this area.";
    list.append(noAlerts);
  } else {
    data.features.forEach((feature) => {
      const alert = document.createElement("li");
      alert.textContent = feature.properties.headline;
      list.append(alert);
    });
  }

  alertsDisplay.append(summaryMessage, list);
}

document.getElementById("fetch-alerts")
  .addEventListener("click", fetchWeatherAlerts);