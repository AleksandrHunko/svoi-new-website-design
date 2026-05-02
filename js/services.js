import { servicesData } from './services-data.js'

export function initServices() {
  const tabsEl    = document.getElementById('services-tabs')
  const listEl    = document.getElementById('services-list')
  const detailEl  = document.getElementById('services-detail')
  const cardsEl   = document.getElementById('services-cards')

  if (!tabsEl) return

  let activeTabId = servicesData[0].id
  let activeServiceIdx = 0

  function getActiveCategory() {
    return servicesData.find(c => c.id === activeTabId)
  }

  function renderTabs() {
    tabsEl.innerHTML = servicesData.map(c => `
      <button
        class="services-tab shrink-0 flex items-center gap-1 pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap text-custom-20px ${
          c.id === activeTabId
            ? 'border-(--theme-text) font-regular'
            : 'border-transparent hover:border-(--theme-text)'
        }"
        data-tab="${c.id}"
      >${c.label} <img class="ml-1 w-4 h-4 rotate-90" src="/img/material-design/link-inner.svg"></button>
    `).join('')

    tabsEl.querySelectorAll('.services-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTabId = btn.dataset.tab
        activeServiceIdx = 0
        renderTabs()
        renderList()
        renderDetail()
        renderCards()
      })
    })
  }

  function renderList() {
    const cat = getActiveCategory()
    listEl.innerHTML = cat.services.map((s, i) => `
      <button
        class="services-item flex justify-between items-start w-full font-regular cursor-pointer text-left p-4 border-b border-(--theme-text) gap-4 transition-opacity ${
          i === activeServiceIdx ? 'bg-white text-black' : 'hover:bg-white hover:text-black'
        }"
        data-idx="${i}"
      >
        <span class="text-regular">${s.title}</span>
        <img class="w-6 h-6 shrink-0 my-auto mr-1 ${i === activeServiceIdx ? '' : 'invisible'}" src="/img/material-design/arrow-right.svg" alt="">
      </button>
    `).join('')

    listEl.querySelectorAll('.services-item').forEach(btn => {
      btn.addEventListener('click', () => {
        activeServiceIdx = parseInt(btn.dataset.idx)
        updateListActive()
        renderDetail()
        scrollMobileToActive()
      })
    })
  }

  function updateListActive() {
    listEl.querySelectorAll('.services-item').forEach((btn, i) => {
      const arrow = btn.querySelector('img')
      const active = i === activeServiceIdx
      btn.classList.toggle('bg-white', active)
      btn.classList.toggle('text-black', active)
      arrow?.classList.toggle('invisible', !active)
    })
  }

  function renderDetail() {
    const cat = getActiveCategory()
    const service = cat.services[activeServiceIdx]
    detailEl.innerHTML = `
      <p class="inline-block text-regular md:text-custom-18px border-b-2 w-auto pb-1 mb-6">${cat.label}</p>
      <h3 class="text-big mb-6">${service.title}</h3>
      <p class="text-regular font-light">${service.description}</p>
      <div class="flex flex-wrap gap-4 mt-8">
        <a href="${service.url}" class="button-black px-8">Переглянути</a>
        ${service.queueUrl ? `<a href="${service.queueUrl}" class="button-transparent">Записатися в чергу</a>` : ''}
      </div>
    `
  }

  function renderCards() {
    const cat = getActiveCategory()
    cardsEl.innerHTML = cat.services.map(s => `
      <div class="w-[92vw] md:w-auto snap-start shrink-0">
        <div class="bg-white text-black rounded-3xl p-6">
          <p class="inline-block text-regular md:text-custom-18px w-auto pb-1 mb-6">${cat.label}</p>
          <h3 class="text-big mb-6">${s.title}</h3>
          <p class="text-regular font-light">${s.description}</p>
          <div class="flex flex-wrap gap-3 mt-6">
            <a href="${s.url}" class="button-black px-6">Переглянути</a>
            ${s.queueUrl ? `<a href="${s.queueUrl}" class="button-transparent">Записатися в чергу</a>` : ''}
          </div>
        </div>
      </div>
    `).join('')
  }

  

  renderTabs()
  renderList()
  renderDetail()
  renderCards()
}
