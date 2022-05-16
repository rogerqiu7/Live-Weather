// set html elements as variables
const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit-btn");
const error = document.querySelector(".error-msg");
form.addEventListener("submit", handleSubmit);
submitBtn.addEventListener("click", handleSubmit);

// set handlesubmit function to fetch weather
function handleSubmit(e) {
	e.preventDefault();
	fetchWeather();
}

// get weather data function takes location, fetches weather API
// if 400, throw error, else, don't display error, process weather data and new data and display new data
async function getWeatherData(location) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=1986480656ec490d950204923202611&q=${location}`,
		{
			mode: "cors",
		}
	);
	if (response.status === 400) {
		throwErrorMsg();
	} else {
		error.style.display = "none";
		const weatherData = await response.json();
		// set newdata as processdata function taking json converted response
		const newData = processData(weatherData);
		//perform displaydata on newdata
		displayData(newData);
		reset();
	}
}

// throw error msg function
function throwErrorMsg() {
	error.style.display = "block";
	if (error.classList.contains("fade-in")) {
		error.style.display = "none";
		error.classList.remove("fade-in2");
		error.offsetWidth;
		error.classList.add("fade-in");
		error.style.display = "block";
	} else {
		error.classList.add("fade-in");
	}
}

// processdata function takes raw weatherdata from API
// my data is data read from Weatherdata json
// read condition, feels like, current temp, wind, humidity and location name
function processData(weatherData) {
	const myData = {
		condition: weatherData.current.condition.text,
		feelsLike: {
			f: Math.round(weatherData.current.feelslike_f),
			c: Math.round(weatherData.current.feelslike_c),
		},
		currentTemp: {
			f: Math.round(weatherData.current.temp_f),
			c: Math.round(weatherData.current.temp_c),
		},
		wind: Math.round(weatherData.current.wind_mph),
		humidity: weatherData.current.humidity,
		location: weatherData.location.name.toUpperCase(),
	};

	// if in the US, add state
	// if not, add country
	if (weatherData.location.country === "United States of America") {
		myData["region"] = weatherData.location.region.toUpperCase();
	} else {
		myData["region"] = weatherData.location.country.toUpperCase();
	}
	return myData;
}

// display data takes new data, sets info in html to weatherinfo variable
// set condition in html as newdata.condition
// set location in html as new data location and region
// set degrees in html as new data current temp
// set feels like in html as new data feels like
// set wind mph in html as newdata wind
// set hmidity in html as newdata humidity
function displayData(newData) {
	const weatherInfo = document.getElementsByClassName("info");
	Array.from(weatherInfo).forEach((div) => {
		if (div.classList.contains("fade-in2")) {
			div.classList.remove("fade-in2");
			div.offsetWidth;
			div.classList.add("fade-in2");
		} else {
			div.classList.add("fade-in2");
		}
	});
	document.querySelector(".condition").textContent = newData.condition;
	document.querySelector(
		".location"
	).textContent = `${newData.location}, ${newData.region}`;
	document.querySelector(".degrees").textContent = newData.currentTemp.f;
	document.querySelector(
		".feels-like"
	).textContent = `FEELS LIKE: ${newData.feelsLike.f}`;
	document.querySelector(".wind-mph").textContent = `WIND: ${newData.wind} MPH`;
	document.querySelector(
		".humidity"
	).textContent = `HUMIDITY: ${newData.humidity}`;
}

// reset function resets the form
function reset() {
	form.reset();
}

// fetchweater function sets search input as userinput
// userlocation is input.value, use getweatherdata function on input.value
function fetchWeather() {
	const input = document.querySelector('input[type="text"]');
	const userLocation = input.value;
	getWeatherData(userLocation);
}
