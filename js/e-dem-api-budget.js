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
  insertedItem.setAttribute('href', item.url_project || item.link)
  insertedItem.setAttribute('target', '_blank')
  const votingOpen = new Date(item.time_end) > new Date()

  insertedItem.innerHTML = `
    <p class="bg-colored-80 text-small font-light text-center rounded-xl py-1 px-3 mb-4 w-fit">
      ${shortDate(item.time_start)}
    </p>
    <h3 class="text-big mb-4 pt-4 pr-7 border-t-2 border-black">${item.title}</h3>
    <p class="text-regular font-medium mb-1">Початок голосування:</p>
    <p class="text-regular font-light mb-4">${longDate(item.time_start)}</p>
    ${votingOpen ? `
      <p class="text-regular font-medium mb-1">До кінця голосування залишилось:</p>
      <p class="text-regular font-light mb-4">${daysLeft(item.time_end)} днів</p>
    ` : `
      <p class="text-regular font-medium mb-1">Голосування завершено:</p>
      <p class="text-regular font-light mb-4">${longDate(item.time_end)}</p>
    `}
    <p class="text-regular font-medium mb-1">Необхідний бюджет:</p>
    <p class="text-regular font-light mb-4">${item.budget} грн</p>
    <p class="text-regular font-light">Зібрано ${item.votes} голосів</p>
    <img class="md:hidden group-hover:block absolute w-7 h-7 top-16 right-0 pointer-events-none" src="/img/material-design/link.svg" alt="">
  `
  return insertedItem
}

function showBudgets(container, link) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      container.innerHTML = ''
      const response = JSON.parse(this.responseText)
      const budgets = response.projects

      if (budgets.length == 0) {
        container.innerHTML = '<h3 class="text-big">Проєктів бюджету не знайдено</h3>'
        return
      }

      for (let i = 0; i < Math.min(budgets.length, 8); i++) {
        container.appendChild(itemSchema(budgets[i]))
      }
    }
  }
  xmlhttp.open("GET", link, true);
  xmlhttp.send();
}

function handleResponse(container, koatuu, schedule) {
  const latestBudget = schedule[schedule.length - 1]
  const today = new Date()
  const start_registration = new Date(latestBudget.start_register)
  const start_consider = new Date(latestBudget.start_consider)
  const start_sign = new Date(latestBudget.start_sign)
  const start_detect = new Date(latestBudget.start_detect)
  const start_realize = new Date(latestBudget.start_realize)
  const end_realize = new Date(latestBudget.end_realize)

  let                             currentPeriod = 'pre_registration'
  if (today > start_registration) currentPeriod = 'registration'
  if (today > start_consider)     currentPeriod = 'consider'
  if (today > start_sign)         currentPeriod = 'sign'
  if (today > start_detect)       currentPeriod = 'detect'
  if (today > start_realize)      currentPeriod = 'realize'
  if (today > end_realize)        currentPeriod = 'end_realize'

  if (currentPeriod == 'sign' || currentPeriod == 'detect') {
    showBudgets(container, `https://e-dem.ua/api/v1/local_governments/${koatuu}/budgets`)
  } else {
    showBudgets(container, `https://e-dem.ua/api/v1/local_governments/${koatuu}/budgets/competition/${latestBudget.id}`)
    document.getElementById('edem-heading').innerHTML = 'Бюджети на реалізації'
  }
}

export function initEdemBudgets(koatuu) {
  const container = document.getElementById('edem-container')
  if (!container) return

  document
    .querySelectorAll('.edem-all-link')
    .forEach((link) => link.setAttribute('href', `https://budget.e-dem.ua/${koatuu}`))

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.responseText)
      handleResponse(container, koatuu, response)
    }
  }
  xmlhttp.open("GET", `https://e-dem.ua/api/v1/local_governments/${koatuu}/budgets/competition`, true);
  xmlhttp.send();
}
