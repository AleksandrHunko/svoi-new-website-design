const institution_id = document.querySelector('#queue').dataset.institution

let chosenDay = '00'
let ut = null

window.onload = function () {

  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200 && this.responseText.length != 0) {
      const result = JSON.parse(this.responseText).body

      const typeSelect = document.querySelector('#queue-type')
      for (let i = 0; i < result.length; i++) {
        let opt = document.createElement('option');
        opt.innerHTML = result[i].description;
        opt.value = result[i].queue_instance_id;
        typeSelect.appendChild(opt);
      }

      document.querySelector('#queue-type').addEventListener('change', () => {
        setDays(result, document.querySelector('#queue-type').value)
        document.querySelector('.queue-block').classList.remove('hidden')
        document.querySelector('.queue-block').scrollIntoView({behavior: "smooth"})
        document.querySelector('.queue-schedule').classList.add('hidden')
        document.querySelector('.queue-continue-registration').classList.add('hidden')
        document.querySelector('#time-select').options.selectedIndex = 0
        const activeDays = document.querySelector('.days-grid').querySelectorAll('.item.active')
        removeSelectionDays(activeDays)
      })

      function findDigit(id) {
        for (let i = 0; i < result.length; i++) {
          console.log(result[i].digit_info);
          const answer = JSON.parse(result[i].digit_info).filter(function (element) { return element.id == id })
          console.log(answer);
          if (answer.length > 0) return {
            queue_instance_id: result[i].queue_instance_id,
            digit_id: answer[0].id,
            digit_name: answer[0].name
          }
        }
        return false
      }

      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.get('digit_number')) {

        const digit = findDigit(urlParams.get('digit_number'))

        if (digit) {
        
          document.querySelector('#queue-type').value = digit.queue_instance_id

          document.querySelector('#queue-type').parentNode.insertAdjacentHTML('beforeend', '<br><p style="color: green">Обрано чергу для запису на послугу "' + digit.digit_name + '"</p>')

          const scrollToNode = document.querySelector('p[style*="green"]');
          scrollToNode.scrollIntoView({behavior: "smooth"});

          setDays(result, document.querySelector('#queue-type').value)
          document.querySelector('.queue-block').classList.remove('hidden')
          document.querySelector('.queue-schedule').classList.add('hidden')
          document.querySelector('.queue-continue-registration').classList.add('hidden')
          document.querySelector('#time-select').options.selectedIndex = 0
          const activeDays = document.querySelector('.days-grid').querySelectorAll('.item.active')
          removeSelectionDays(activeDays)

        }
        
      }

      if (urlParams.get('ut')) ut = urlParams.get('ut')

    }
  }

  xmlhttp.open("GET", `https://toolkit.in.ua/queue-api/generate-slots/${institution_id}`, true);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  xmlhttp.send()

  function setDays(data, queue_instance_id) {
    const today = new Date()
    let todayWeekDay = today.getDay()
    if (todayWeekDay == 0) todayWeekDay = 7
    const daysToAddBefore = todayWeekDay
    const daysToAddAfter = 7 - todayWeekDay

    document.querySelector('.queue-block').querySelector('.days-grid').innerHTML = ''
    for (let i = 1; i <= daysToAddBefore; i++) {
      let insertedDiv = document.createElement('div')
      insertedDiv.classList.add("item", "bg-[#F0F0F0]", "h-16", "md:h-24", "flex", "py-5", "md:py-10", "justify-center", "mr-1", "mb-1");
      let date = new Date()
      date.setDate(date.getDate() - daysToAddBefore + i);
      insertedDiv.innerHTML = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}`
      document.querySelector('.queue-block').querySelector('.days-grid').appendChild(insertedDiv)
    }
    const days = data.filter(function (element) { return element.queue_instance_id == queue_instance_id })[0].days
    for (let i = 0; i < days.length; i++) {

      let insertedDiv = document.createElement('div')
      insertedDiv.classList.add("item", "h-16", "md:h-24", "flex", "py-5", "md:py-10", "justify-center", "mr-1", "mb-1");
      if (days[i].active == 1 && hasSlots(days[i].slots)) {
        insertedDiv.classList.add("active", "bg-colored", "cursor-pointer", "hover:opacity-80");
      } else if (days[i].active == 1) {
        insertedDiv.classList.add("full", "bg-[#959595]");
      } else {
        insertedDiv.classList.add("bg-[#F0F0F0]");
      }
      insertedDiv.innerHTML = days[i].dayForFrontend
      insertedDiv.dataset.day = days[i].day
      document.querySelector('.queue-block').querySelector('.days-grid').appendChild(insertedDiv)
    }

    for (let i = 0; i < daysToAddAfter; i++) {
      let insertedDiv = document.createElement('div')
      insertedDiv.classList.add("item", "bg-[#F0F0F0]", "h-16", "md:h-24", "flex", "py-5", "md:py-10", "justify-center", "mr-1", "mb-1");
      let date = new Date()
      date.setDate(date.getDate() + 15 + i);
      insertedDiv.innerHTML = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}`
      document.querySelector('.queue-block').querySelector('.days-grid').appendChild(insertedDiv)
    }

    const activeDays = document.querySelector('.days-grid').querySelectorAll('.item.active')

    for (let i = 0; i < activeDays.length; i++) {
      activeDays[i].addEventListener('click', function () {
        removeSelectionDays(activeDays)
        this.classList.add('selected', 'bg-colored-80')
        document.querySelector('.queue-schedule').classList.remove('hidden')
        document.querySelector('.queue-schedule').scrollIntoView({behavior: "smooth"})
        document.querySelector('.queue-schedule').querySelector('h2').innerHTML = `Оберіть час прийому (${this.innerHTML})`
        document.querySelector('#time-select').options.selectedIndex = 0
        document.querySelector('.queue-continue-registration').classList.add('hidden')
        chosenDay = this.dataset.day
        setTimes(data, chosenDay, queue_instance_id)
      })
    }
  }

  function removeSelectionDays(activeDays) {
    for (let i = 0; i < activeDays.length; i++) {
      activeDays[i].classList.remove('selected', 'bg-colored-80')
    }
  }

  function setTimes(data, day, queue_instance_id) {
    const days = data.filter(function (element) { return element.queue_instance_id == queue_instance_id })[0].days
    const slots = days.filter(function (element) { return element.day == day })[0].slots
    let timeSelect = document.querySelector("#time-select");

    //clear old options
    for (let i = timeSelect.options.length - 1; i > 0; i--) {
      timeSelect.removeChild(timeSelect.options[i])
    }
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].amount > 0) {
        let opt = document.createElement('option');
        opt.value = slots[i].time;
        opt.innerHTML = slots[i].time;
        timeSelect.appendChild(opt)
      }
    }
  }

  function hasSlots(slots) {
    let has_slots = false
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].amount != 0) has_slots = true
    }
    return has_slots
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

        const params = {
          code: JSON.parse(this.responseText).code,
          day: chosenDay,
          time: document.querySelector("#time-select").value,
          ut:  ut || null
        };
        
        const encoded = btoa(JSON.stringify(params));
        let appendedLink = `/queue-register?q=${encoded}`;

        window.location.href = location.protocol + '//' + location.host + location.pathname + appendedLink;
      } else if ( this.readyState == 4 && (this.status == 406 || this.status == 400)) {
        alert('Сталася помилка при записі на цей час. Спробуйте запис на інший час')
        location.reload()
      }
    }
    xmlhttp.open("POST", "https://toolkit.in.ua/queue-api/freeze-slot", true);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xmlhttp.send(JSON.stringify({
      day: chosenDay,
      time: document.querySelector("#time-select").value,
      queue_instance_id: document.querySelector("#queue-type").value
    }));
  })
}
