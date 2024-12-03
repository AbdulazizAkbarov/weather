function fetchWeatherData(query) {
    const apiKey = "eb421d2b8ca24b9f8e160551240212";
    const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=4&aqi=no&alerts=no`;
  
    fetch(weatherApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ob-havo olishda xatolik!");
        }
        return response.json();
      })
      .then((data) => {
    
        const city = data.location.name;
        const temp = data.current.temp_c;
        const weather = data.current.condition.text;
        const icon = data.current.condition.icon;
  
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const time = `${hours}:${minutes}`;
        const options = { weekday: "long", day: "numeric", month: "short" };
        const date = now.toLocaleDateString("en-US", options);
  
        document.querySelector(".athens h2").textContent = city;
        document.querySelector(".athens h2:nth-child(2)").textContent = time;
        document.querySelector(".athens p").textContent = date;
  
        document.querySelector(".box1 h2").textContent = `${temp}°C`;
        document.querySelector(".box2 h2").textContent = weather;
        document.querySelector(".box2 img").src = `https:${icon}`;
  
        const forecastDays = data.forecast.forecastday.slice(0, 4);
        const daysContainer = document.querySelector(".days-forecast > div");
        daysContainer.innerHTML = "";
        forecastDays.forEach((day) => {
          const dayHTML = `
            <div class="wrapper">
              <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <h2>${day.day.avgtemp_c}°C</h2>
              <p>${new Date(day.date).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}</p>
            </div>`;
          daysContainer.innerHTML += dayHTML;
        });
  
   
        const hourlyForecast = data.forecast.forecastday[0].hour.slice(0, 4);
        const hourlyContainer = document.querySelector(".hourly-forecast");
        hourlyContainer.innerHTML = "<h2>Hourly Forecast:</h2>"; 
        hourlyForecast.forEach((hour) => {
          const hourHTML = `
            <div class="wrap1">
              <h3>${new Date(hour.time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}</h3>
              <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" />
              <h3>${hour.temp_c}°C</h3>
              <img src="./navigation 1.png" alt="Wind Speed" />
              <h3>${hour.wind_kph} km/h</h3>
            </div>`;
          hourlyContainer.innerHTML += hourHTML;
        });
      })
      .catch((error) => {
        console.error(error.message);
        alert("Ob-havo ma'lumotlarini olishda xato.");
      });
  }
  const searchInput = document.querySelector(".input_wrap input");
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        fetchWeatherData(query);
      } else {
        alert("Shahar yoki davlat nomini kiriting!");
      }
    }
  });
  
  document.querySelector("button").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(`${latitude},${longitude}`);
        },
        (error) => {
          console.error(error.message);
          alert("Joylashuvni aniqlashda xato bor.");
        }
      );
    } else {
      alert("Brauzeringiz joylashuvni qo'llab-quvvatlamaydi.");
    }
  });
  