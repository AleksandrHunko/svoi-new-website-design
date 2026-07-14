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

const daysLeft = (end_date) => Math.ceil(Math.abs((new Date(end_date) - new Date()) / (24 * 60 * 60 * 1000)))

const itemSchema = (item) => {
  const insertedItem = document.createElement('a')
  insertedItem.classList.add("relative", "group", "rounded-3xl", "flex", "flex-col")
  insertedItem.setAttribute('href', item.link)
  insertedItem.setAttribute('target', '_blank')
  insertedItem.innerHTML = `
    <p class="bg-colored-80 text-small font-light text-center rounded-xl py-1 px-3 mb-4 w-fit">
      ${shortDate(item.start_date)}
    </p>
    <h3 class="text-big mb-4 pt-4 pr-7 border-t-2 border-black">${item.title}</h3>
    <p class="text-regular font-medium mb-1">Початок голосування:</p>
    <p class="text-regular font-light mb-4">${longDate(item.start_date)}</p>
    <p class="text-regular font-medium mb-1">До кінця голосування залишилось:</p>
    <p class="text-regular font-light mb-4">${daysLeft(item.end_date)} днів</p>
    <div class="flex items-center gap-2 mb-4">
      <svg class="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path class="fill" fill="#000" d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
      </svg>
      <p class="text-regular font-light">${item.views_count} переглядів</p>
    </div>
    <div class="flex items-center gap-2">
      <svg class="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path class="fill" fill="#000" d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
      </svg>
      <p class="text-regular font-light">${item.number_votes} користувачів проголосувало</p>
    </div>
    <img class="md:hidden group-hover:block absolute w-7 h-7 top-16 right-0 pointer-events-none" src="/img/material-design/link.svg" alt="">
  `
  return insertedItem
}

export function initEdemConsultations(koatuu) {
  const container = document.getElementById('edem-container')
  if (!container) return

  document
    .querySelectorAll('.edem-all-link')
    .forEach((link) => link.setAttribute('href', `https://consult.e-dem.ua/${koatuu}`))

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      container.innerHTML = ''
      const response = JSON.parse(this.responseText)

      const consultations = response.consultations
      const polls = response.polls
      const npas = response.npas

      const items = [
        ...consultations.slice(0, 4),
        ...polls.slice(0, 4),
        ...npas.slice(0, 4)
      ]

      for (let i = 0; i < items.length; i++) {
        container.appendChild(itemSchema(items[i]))
      }

      if (items.length == 0) {
        container.innerHTML = '<h3 class="text-big">Консультацій не знайдено</h3>'
      }
    }
  }
  xmlhttp.open("GET", `https://e-dem.ua/api/v1/local_governments/${koatuu}/consultations?filters[status]=active`, true);
  xmlhttp.send();
}
