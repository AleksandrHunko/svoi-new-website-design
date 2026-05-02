export function initEcomonitoring(community_id) {
  if (!document.querySelector('#aqi-value')) return

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.responseText)

      const select = document.querySelector('.eco-station')

      let first_option = document.createElement('option');
      first_option.value = 0;
      first_option.innerHTML = `${response.data[0].sensor_name} (${response.data[0].city_name})`;
      first_option.selected = 'selected'
      select.appendChild(first_option);

      for (let i = 1; i < response.data.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = `${response.data[i].sensor_name} (${response.data[i].city_name})`;
        select.appendChild(opt);
      }

      fillData(response.data[0])

      document.querySelector('.eco-station').addEventListener('change', () => {
        let i = parseInt(document.querySelector('.eco-station').value)
        fillData(response.data[i])
      })
    }
  }
  xmlhttp.open("GET", `https://api.toolkit.in.ua/ecoapi/v1/get-data/${community_id}`, true);
  xmlhttp.send();
}

function fillData(data) {
  const date = new Date(data.updated_at)

  const formattedDate = date.toLocaleString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  addAQI(data.pm25, document.querySelector("#aqi-value"))
  document.querySelector("#humidity-value").innerHTML = `${data.humidity}%`
  document.querySelector("#temperature-value").innerHTML = `${data.temperature}<sup> ℃</sup>`
  document.querySelector("#pm25-value").innerHTML = `${data.pm25} мкг/м³`
  document.querySelector("#pm10-value").innerHTML = `${data.pm10} мкг/м³`
  document.querySelector("#pressure-value").innerHTML = `${data.pressure} мм.рт.ст.`
  document.querySelector("#last-updated-value").innerHTML = `${formattedDate}`
  document.querySelector("#station-name-value").innerHTML = `${data.sensor_name}`
  document.querySelector("#city-name-value").innerHTML = `${data.city_name}`

  if (data.provider == 'saveecobot') {
    document.querySelector("#provider-value").innerHTML = "saveecobot"
    document.querySelector("#provider-value").href = "https://www.saveecobot.com"
  } else {
    document.querySelector("#provider-value").innerHTML = "ecocity"
    document.querySelector("#provider-value").href = "https://eco-city.org.ua"
  }
}

function addAQI(pm25, element) {
  const circle = element.querySelector('.circle')
  const span = element.querySelector('span')
  let aqi;
  if (pm25 >= 0 && pm25 <= 12.0) {
    aqi = interpolate(pm25, 0, 12.0, 0, 50);
    circle.style.background = "#2CE07F"
    span.textContent = aqi
  } else if (pm25 > 12.0 && pm25 <= 35.4) {
    aqi = interpolate(pm25, 12.1, 35.4, 51, 100);
    circle.style.background = "#E4FF3D"
    span.textContent = aqi
  } else if (pm25 > 35.4 && pm25 <= 55.4) {
    aqi = interpolate(pm25, 35.5, 55.4, 101, 150);
    circle.style.background = "#FF9A3D"
    span.textContent = aqi
  } else if (pm25 > 55.4 && pm25 <= 150.4) {
    aqi = interpolate(pm25, 55.5, 150.4, 151, 200);
    circle.style.background = "#B52626"
    span.textContent = aqi
  } else if (pm25 > 150.4 && pm25 <= 250.4) {
    aqi = interpolate(pm25, 150.5, 250.4, 201, 300);
    circle.style.background = "#B52626"
    span.textContent = aqi
  } else if (pm25 > 250.4 && pm25 <= 350.4) {
    aqi = interpolate(pm25, 250.5, 350.4, 301, 400);
    circle.style.background = "#B52626"
    span.textContent = aqi
  } else if (pm25 > 350.4 && pm25 <= 500.4) {
    aqi = interpolate(pm25, 350.5, 500.4, 401, 500);
    circle.style.background = "#B52626"
    span.textContent = aqi
  } else {
    console.log(aqi = "out of range");
  }
}

function interpolate(value, low1, high1, low2, high2) {
  return Math.round(((high2 - low2) * (value - low1)) / (high1 - low1) + low2);
}
