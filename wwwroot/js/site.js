// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", function () {
    const authTokenKey = "authToken";
    // Function to fetch the auth token
    function fetchAuthToken() {
        // Make an API request to get a new auth token every time
        return fetch("https://www.universal-tutorial.com/api/getaccesstoken", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "api-token": "0IWTOricjda0T_JG1bOxmr8D1OfX2DHKWuJbjnZdC6uYMnM3-OP1afaVMZtRYAG6NSE",
                "user-email": "austinrhodes462@gmail.com"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch auth token");
                }
                return response.json();
            })
            .then(data => {
                // Store the auth token in local storage
                const authToken = data.auth_token;
                localStorage.setItem(authTokenKey, authToken);
                return authToken;
            })
            .catch(error => {
                console.error("Error fetching auth token:", error);
                return null;
            });
    }    

    // Call the fetchAuthToken function and use the token as needed
    fetchAuthToken()
        .then(authToken => {
            if (authToken) {
                // Use the authToken for API requests or other purposes
                console.log("Access Token:", authToken);
                populateCountries(authToken);
            } else {
                console.error("No valid auth token available.");
            }
        });

    const countrySelect = document.getElementById("countrySelect");
    const stateSelect = document.getElementById("stateSelect");
    const citySelect = document.getElementById("citySelect");

    
    const BASE_URL = "https://www.universal-tutorial.com/api/states/";
    // Function to populate the country dropdown with options from the API
    function populateCountries(authToken) {
        // Make an API request to get the list of countries
        fetch("https://www.universal-tutorial.com/api/countries", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Accept": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                // Clear the current options
                countrySelect.innerHTML = "<option value=''>Select a country</option>";
                console.log(data);
                // Populate the country dropdown with options from the API
                data.forEach(country => {
                    const option = document.createElement("option");
                    option.value = country.country_name;
                    option.textContent = country.country_name;
                    countrySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error fetching countries:", error);
            });
    }

    function populateStates() {
        const selectedCountry = countrySelect.value;
        stateSelect.innerHTML = "<option value=''>Select a state</option>";
        citySelect.innerHTML = "<option value=''>Select a city</option>";

        if (selectedCountry) {
            // Make an API request to get the states for the selected country
            const apiUrl = `${BASE_URL}${selectedCountry}`;

            fetchAuthToken()
                .then(authToken => {
                    if (authToken) {
                        fetch(apiUrl, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${authToken}`,
                                "Accept": "application/json"
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                //if (data && data.length > 0) {
                                // Populate the state dropdown with data from the API
                                data.forEach(state => {
                                    const option = document.createElement("option");
                                    option.value = state.state_name;
                                    option.textContent = state.state_name;
                                    stateSelect.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error("Error fetching states:", error);
                            });
                    } else {
                        console.error("No valid auth token available.");
                    }
                });            
        }
    }

    // Function to populate the city dropdown based on the selected state
    function populateCities() {
        const selectedState = stateSelect.value;
        citySelect.innerHTML = "<option value=''>Select a city</option>";

        var authToken = fetchAuthToken();

        if (selectedState) {
            // Make an API request to get the cities for the selected state
            const selectedCountry = countrySelect.value;
            const apiUrl = `https://www.universal-tutorial.com/api/cities/${selectedState}`;

            fetchAuthToken()
                .then(authToken => {
                    if (authToken) {
                        fetch(apiUrl, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${authToken}`,
                                "Accept": "application/json"
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                // Populate the city dropdown with data from the API
                                if (data && data.length > 0) {
                                    data.forEach(city => {
                                        const option = document.createElement("option");
                                        option.value = city.city_name;
                                        option.textContent = city.city_name;
                                        citySelect.appendChild(option);
                                    });
                                } else {
                                    // Display a message when there are no cities available
                                    const option = document.createElement("option");
                                    option.value = "";
                                    option.textContent = "No cities available";
                                    citySelect.appendChild(option);
                                }                                
                            })
                            .catch(error => {
                                console.error("Error fetching cities:", error);
                            });
                    } else {
                        console.error("No valid auth token available.");
                    }
                });
        }        
    }

    // Function to check and update the "Get Weather" button's disabled state
    function updateGetWeatherButtonState() {
        const selectedCountry = countrySelect.value;
        const selectedState = stateSelect.value;
        const selectedCity = citySelect.value;
        const getWeatherButton = document.getElementById("getWeatherButton");

        if (!selectedCountry || !selectedState || !selectedCity) {
            // If any of the dropdowns are not selected, disable the button
            getWeatherButton.disabled = true;
        } else {
            // Enable the button when all dropdowns have valid selections
            getWeatherButton.disabled = false;
        }
    }

    function displayNoWeatherInfoMessage() {

        // Display a message to the user
        const messageElement = document.createElement("p");
        messageElement.textContent = "No weather information available for the selected location.";
        // Append the message to a suitable location in your HTML
        // Example: document.getElementById("weatherInfoContainer").appendChild(messageElement);
    }

    const getWeatherButton = document.getElementById("getWeatherButton");
    getWeatherButton.addEventListener("click", fetch)

    // Add event listeners to the dropdowns to update the button state
    countrySelect.addEventListener("change", updateGetWeatherButtonState);
    stateSelect.addEventListener("change", updateGetWeatherButtonState);
    citySelect.addEventListener("change", updateGetWeatherButtonState);
    // Initial check to disable the button on page load
    updateGetWeatherButtonState();

    countrySelect.addEventListener("change", populateStates);
    stateSelect.addEventListener("change", populateCities);



});
