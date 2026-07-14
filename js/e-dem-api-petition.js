const shortDate = (value) => new Date(value).toLocaleDateString("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
})

const longDate = (value) => new Date(value).toLocaleDateString("uk-UA", {
  day: "numeric",
  month: "long",
  year: "numeric"
})

const daysLeft = (time_end) => Math.ceil(Math.abs((new Date(time_end) - new Date()) / (24 * 60 * 60 * 1000)))

const itemSchema = (item) => {
  const insertedItem = document.createElement('a')
  insertedItem.classList.add("relative", "group", "rounded-3xl", "flex", "flex-col")
  insertedItem.setAttribute('href', item.link)
  insertedItem.setAttribute('target', '_blank')

  const signsPercent = Math.min(Math.round((item.count_signs / item.required_signs) * 100), 100)

  insertedItem.innerHTML = `
    <p class="bg-colored-80 text-small font-light text-center rounded-xl py-1 px-3 mb-4 w-fit">
      ${shortDate(item.time_start)}
    </p>
    <h3 class="text-big mb-4 pt-4 pr-7 border-t-2 border-black">${item.title}</h3>
    <p class="text-regular font-medium mb-1">Початок збору підписів:</p>
    <p class="text-regular font-light mb-4">${longDate(item.time_start)}</p>
    <p class="text-regular font-medium mb-1">До кінця збору підписів залишилось:</p>
    <p class="text-regular font-light mb-4">${daysLeft(item.time_end)} днів</p>
    <p class="text-regular font-light mb-2">Зібрано ${item.count_signs} підписів з ${item.required_signs}</p>
    <div class="w-full h-2 rounded-full bg-[#d9d9d9]">
      <div class="h-2 rounded-full bg-colored-80" style="width: ${signsPercent}%"></div>
    </div>
    <img class="md:hidden group-hover:block absolute w-7 h-7 top-16 right-0 pointer-events-none" src="/img/material-design/link.svg" alt="">
  `
  return insertedItem
}

function renderPetitions(container, petitions) {
  container.innerHTML = ''

  if (petitions.length == 0) {
    container.innerHTML = '<h3 class="text-big">Петицій не знайдено</h3>'
    return
  }

  for (let i = 0; i < Math.min(petitions.length, 8); i++) {
    container.appendChild(itemSchema(petitions[i]))
  }
}

export function initEdemPetitions(koatuu) {
  const container = document.getElementById('edem-container')
  if (!container) return

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.responseText)
      renderPetitions(container, response.projects)
    }
  }
  xmlhttp.open("GET", `https://e-dem.ua/api/v1/local_governments/${koatuu}/petition_projects?filters[status_name]=Published`, true);
  xmlhttp.send();
}
