import { newsData } from './news-tabs-data.js'

export function initNews() {
  const tabsEl = document.getElementById('news-tabs')
  const listEl = document.getElementById('news-scrollbar')

  if (!tabsEl) return

  let activeTabId = newsData[0].id

  function getActiveTab() {
    return newsData.find(t => t.id === activeTabId)
  }

  function renderTabs() {
    tabsEl.innerHTML = newsData.map(t => `
      <button
        class="news-tab shrink-0 pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap text-custom-20px ${
          t.id === activeTabId
            ? 'border-black font-regular'
            : 'border-transparent hover:border-black'
        }"
        data-tab="${t.id}"
      >${t.label}</button>
    `).join('')

    tabsEl.querySelectorAll('.news-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTabId = btn.dataset.tab
        renderTabs()
        renderItems()
      })
    })
  }

  function renderItems() {
    const tab = getActiveTab()
    listEl.innerHTML = tab.items.map(item => `
      <a href="${item.href}" class="group bg-colored rounded-4xl relative hover:bg-colored-80 flex-1 max-w-10/12 md:max-w-md min-w-xs overflow-hidden snap-start">
        <img class="w-full aspect-video object-cover mb-2" src="${item.img}" alt="">
        <div class="flex flex-wrap px-6 mt-6 mb-4 gap-2">
          ${item.tags.map(tag => `
            <p class="block bg-colored-80 group-hover:bg-colored transition-colors text-small font-light rounded-3xl py-1 px-2">${tag}</p>
          `).join('')}
        </div>
        <p class="text-small px-6 mb-5">${item.date}</p>
        <h3 class="text-medium px-6 mb-3 max-h-[70px] md:max-h-[77px] lg:max-h-[84px] overflow-hidden">${item.title}</h3>
        <p class="text-regular font-light max-h-[93px] overflow-hidden px-6 mb-10">${item.description}</p>
      </a>
    `).join('')
  }

  renderTabs()
  renderItems()
}
