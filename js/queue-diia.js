const queue_id = document.querySelector('#queue').dataset.queue

const api_host = 'https://api.toolkit.in.ua/diia/v1'

let chosenDay = '00'
let ut = null
let identifier = null
let service_id = null

window.onload = function () {

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('ut')) ut = urlParams.get('ut')

  if (urlParams.get('i')) {
    identifier = urlParams.get('i')
    skipType()
  } else {
    setType();
  }



  document.querySelector('#time-select').addEventListener('change', () => {
    document.querySelector('.queue-continue-registration').classList.remove('hidden')
    document.querySelector('.queue-continue-registration').scrollIntoView({behavior: "smooth"})
    const type_select = document.querySelector('#queue-type')
    document.querySelector('#continue-registration-type').innerHTML = type_select.options[type_select.selectedIndex].text
    document.querySelector('#continue-registration-date').innerHTML = document.querySelector('.days-grid .item.selected').innerHTML
    document.querySelector('#continue-registration-time').innerHTML = document.querySelector('#time-select').value
  })

  document.querySelector('#queue-button').addEventListener('click', () => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.status == 200) {
        console.log('got here');
        
        console.log(JSON.parse(this.responseText));
        if (!JSON.parse(this.responseText).success) {
          alert('Сталася помилка при записі на цей час. Спробуйте запис на інший час')
          location.reload()
        } else {
          const code = JSON.parse(this.responseText).item.bronyid
          const fixedgroup = JSON.parse(this.responseText).item.fixedgroup

          const params = {
            queue_id: queue_id,
            code: code,
            day: chosenDay,
            time: document.querySelector('#time-select').selectedOptions[0].text,
            timeslot_id: document.querySelector('#time-select').value,
            fixedgroup: fixedgroup || null,
            id_q: service_id || null,
            ut:  ut || null,

          };
          
          const encoded = btoa(JSON.stringify(params));
  
          let appendedLink = `/queue-register?q=${encoded}`;
          window.location.href = window.location.href = location.protocol + '//' + location.host + location.pathname + appendedLink;
        }

      } else if ( this.readyState == 4 && (this.status == 406 || this.status == 400)) {
        alert('Сталася помилка при записі на цей час. Спробуйте запис на інший час')
        location.reload()
      }
    }
    xmlhttp.open("POST", `${api_host}/timeslots/reserve-code`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xmlhttp.send(JSON.stringify({
      timeslot_id: document.querySelector('#time-select').value,
      queue_id: queue_id
    }));
  })
}


function setType() {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200 && this.responseText.length != 0) {
      const result = JSON.parse(this.responseText).rows
      

      const typeSelect = document.querySelector('#queue-type')
      for (let i = 0; i < result.length; i++) {
        let opt = document.createElement('option');
        opt.innerHTML = result[i].pdesc;
        opt.value = result[i].id;
        typeSelect.appendChild(opt);
      }
      
      document.querySelector('#queue-type').addEventListener('change', () => {
        setDays(document.querySelector('#queue-type').value)
        document.querySelector('.queue-block').classList.remove('hidden')
        document.querySelector('.queue-block').scrollIntoView({behavior: "smooth"})
        document.querySelector('.queue-schedule').classList.add('hidden')
        document.querySelector('.queue-continue-registration').classList.add('hidden')
        document.querySelector('#time-select').options.selectedIndex = 0
        const activeDays = document.querySelector('.days-grid').querySelectorAll('.item.active')
        removeSelectionDays(activeDays)
      })
    }

  }
  
  
  xmlhttp.open("POST", `${api_host}/workplaces`, true);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  xmlhttp.send(JSON.stringify({ queue_id: queue_id }));
}

function skipType() {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200 && this.responseText.length != 0) {
      
      const result = JSON.parse(this.responseText).item
      if (result && result.checked == '1') {

        selectService(result)
        return
      }
      setType()
      return
    }


  }
  
  xmlhttp.open("POST", `${api_host}/services/get-by-identifier`, true);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  xmlhttp.send(JSON.stringify({ queue_id: queue_id, identifier: identifier }));
}

function selectService(item) {

  service_id = item.id


  document.querySelector('#queue-type').parentElement.classList.add("hidden")

  let insertedServiceName = document.createElement("div");
  insertedServiceName.classList.add("relative", "md:ml-24", "pb-4", "w-full", "md:w-2/3", "mb-8", "md:mb-16")
  insertedServiceName.innerHTML = `
  <p>Обрано:</p>
  <p class="text-green-600 ">${item.qname}</p>
  `

  document.querySelector('#queue-type').parentElement.before(insertedServiceName)

  setDays(null, item.id)
  document.querySelector('.queue-block').classList.remove('hidden')
  document.querySelector('.queue-block').scrollIntoView({behavior: "smooth"})
  document.querySelector('.queue-schedule').classList.add('hidden')
  document.querySelector('.queue-continue-registration').classList.add('hidden')
  document.querySelector('#time-select').options.selectedIndex = 0

}

function setDays(id_p = null, id_q = null) {

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200 && this.responseText.length != 0) {

      const result = JSON.parse(this.responseText).rows

      const today = new Date()
      let todayWeekDay = today.getDay()
      if (todayWeekDay == 0) todayWeekDay = 7
      const daysToAddBefore = todayWeekDay
      const daysToAddAfter = 7 - todayWeekDay

      // reset days grid
      document.querySelector('.queue-block').querySelector('.days-grid').innerHTML = ''
      
      // convert dates to dd.mm
      const activeDates = new Set(
        result.map(r => {
          const d = new Date(r.chdate)
          return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2)
        })
      )
      const middleDays = 14
      const totalDays = daysToAddBefore + middleDays + daysToAddAfter
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysToAddBefore + 1)
      
      for (let i = 0; i < totalDays; i++) {

        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        const formatted = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2)
        const div = document.createElement('div')
        div.classList.add("item", "h-16", "md:h-24", "flex", "py-5", "md:py-10", "justify-center", "mr-1", "mb-1");
        div.dataset.chdate = date.toISOString().slice(0, 10)
        div.innerHTML = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2)

        if (activeDates.has(formatted)) {
          div.classList.add("active", "bg-colored", "cursor-pointer", "hover:opacity-80");

          div.addEventListener('click', function () {
            removeSelectionDays(document.querySelector('.days-grid').querySelectorAll('.item.active'))
            this.classList.add('selected', 'bg-colored-80')
            document.querySelector('.queue-schedule').classList.remove('hidden')
            document.querySelector('.queue-schedule').scrollIntoView({behavior: "smooth"})
            document.querySelector('.queue-schedule').querySelector('h2').innerHTML = `Оберіть час прийому (${this.innerHTML})`
            document.querySelector('#time-select').options.selectedIndex = 0
            setTimes(queue_id, this.dataset.chdate, id_p, id_q)
          })
        } else {
          div.classList.add("bg-[#F0F0F0]");
        }

        document.querySelector('.queue-block .days-grid').appendChild(div)
      }

      
    }

  }
  
  
  xmlhttp.open("POST", `${api_host}/dates`, true);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  const params = {
    queue_id,
    ...(id_p != null && { id_p }),
    ...(id_q != null && { id_q })
  }

  xmlhttp.send(JSON.stringify(params));
}

function removeSelectionDays(activeDays) {
  for (let i = 0; i < activeDays.length; i++) {
    activeDays[i].classList.remove('selected', 'bg-colored-80')
  }
}

function setTimes(queue_id, chdate, id_p = null, id_q = null) {

  chosenDay = '' + chdate.split('-')[2] + '.' + chdate.split('-')[1]

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200 && this.responseText.length != 0) {

      const result = JSON.parse(this.responseText).rows

      let timeSelect = document.querySelector("#time-select");

      //clear old options
      for (let i = timeSelect.options.length - 1; i > 0; i--) {
        timeSelect.removeChild(timeSelect.options[i])
      }

      const seenTimes = new Set();

      for (let i = 0; i < result.length; i++) {
        const time = result[i].chtime;

        // skip duplicates
        if (seenTimes.has(time)) continue;
        seenTimes.add(time);

        let opt = document.createElement('option');
        opt.value = result[i].id;
        opt.innerHTML = `${result[i].chtime.split(':')[0]}:${result[i].chtime.split(':')[1]}`;
        timeSelect.appendChild(opt);
      }
    }
  }

  const params = {
    queue_id,
    chdate,
    ...(id_p != null && { id_p }),
    ...(id_q != null && { id_q })
  }


  xmlhttp.open("POST", `${api_host}/timeslots/list`, true);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  xmlhttp.send(JSON.stringify({ queue_id: queue_id, id_p: id_p, chdate: chdate }));
}


