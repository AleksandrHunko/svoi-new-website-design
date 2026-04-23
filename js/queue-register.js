window.onload = function () {
  function redirectOneLevelHigher() {
    window.location.pathname = window.location.pathname.split('/').slice(0, -1).join('/') || '/';
  }

  const q = new URLSearchParams(window.location.search).get('q');
  if (!q) {
    redirectOneLevelHigher();
    return;
  }
  let data;
  try {
    data = JSON.parse(atob(q));
  } catch (e) {
    redirectOneLevelHigher();
    return;
  }

  const ut = data.ut || null;

  document.querySelector('.queue-content .day').innerHTML =
      `<h4 class="text-medium font-normal mb-2">` +
      `<span>Дата: </span> ` +
      `<span class="day-insert font-medium"></span>` +
      `</h4>`;
    // Use innerText to avoid XSS
    document.querySelector('.day-insert').innerText = `${data.day}`;

    document.querySelector('.queue-content .time').innerHTML =
      `<h4 class="text-medium font-normal mb-8">` +
      `<span>Час: </span> ` +
      `<span class="time-insert font-medium"></span>` +
      `</h4>`;
    // Use innerText to avoid XSS
    document.querySelector('.time-insert').innerText = `${data.time}`;

  const form = document.querySelector('.queue-data-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const inputs = form.querySelectorAll('input');

    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].checkValidity()) {
        valid = false;
        inputs[i].classList.add('invalid');
      }
    }

    if (!valid) return;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const code = JSON.parse(this.responseText).code;

        let appendedLink = `/success?code=${code}`;
        if (ut) appendedLink += `&ut=${ut}`;

        window.location.href =
          location.protocol + '//' + location.host + location.pathname + appendedLink;
      } else if (this.readyState === 4 && (this.status === 406 || this.status === 400)) {
        alert('Сталася помилка при записі на цей час. Спробуйте запис на інший час');
        redirectOneLevelHigher();
      }
    };

    xmlhttp.open('POST', 'https://toolkit.in.ua/queue-api/generate-code', true);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xmlhttp.send(JSON.stringify({
      code: data.code,
      name: document.querySelector("input[name='name']").value,
      tel: document.querySelector("input[name='tel']").value,
      message: document.querySelector("input[name='message']").value
    }));
  });
};
