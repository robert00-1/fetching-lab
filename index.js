document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("state-input");
  const button = document.getElementById("fetch-btn");

  button.addEventListener("click", () => {
    const state = input.value.trim().toUpperCase();

    // Validate state abbreviation
    if (!/^[A-Z]{2}$/.test(state)) {
      showError("Please enter a valid state abbreviation.");
      return;
    }

    fetchWeatherAlert(state);
    input.value = ""; // Clear input
  });
});

// Fetch weather alerts from API
function fetchWeatherAlert(state) {
  showLoading();
  clearError();

  fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => displayAlerts(data))
    .catch(error => showError(error.message))
    .finally(() => hideLoading());
}

// Display alerts in the DOM
function displayAlerts(data) {
  const alertsDiv = document.getElementById("alerts-display");
  alertsDiv.innerHTML = ""; // Clear previous alerts

  const alerts = data.features;

  const summary = document.createElement("h2");
  summary.textContent = `${data.title}: ${alerts.length}`;
  alertsDiv.appendChild(summary);

  if (alerts.length === 0) {
    const noAlerts = document.createElement("p");
    noAlerts.textContent = "No current watches, warnings, or advisories.";
    alertsDiv.appendChild(noAlerts);
    return;
  }

  const ul = document.createElement("ul");
  alerts.forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });
  alertsDiv.appendChild(ul);
}

// Show error
function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

// Clear error
function clearError() {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

// Show/hide loading
function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}
function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}


