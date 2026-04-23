function initVulykForm() {
  const vulykForm = document.getElementById("vulyk-form");
  if (!vulykForm) return;

  const submitButton = document.getElementById("vulyk-submit");

  const loadingEl = document.getElementById("vulyk-loading");
  const resultsViewEl = document.getElementById("vulyk-results-view");
  const resultsEl = document.getElementById("vulyk-results");
  const reloadButton = document.getElementById("vulyk-reload");

  const inputs = Array.from(vulykForm.querySelectorAll("input"));

  function setSubmitDisabled(disabled) {
    if (!submitButton) return;
    submitButton.disabled = disabled;
  }

  function setState(state) {
    // state: "form" | "loading" | "result"
    if (state === "form") {
      vulykForm.classList.remove("hidden");
      loadingEl?.classList.add("hidden");
      resultsViewEl?.classList.add("hidden");
      setSubmitDisabled(false);
      return;
    }

    if (state === "loading") {
      vulykForm.classList.add("hidden");
      loadingEl?.classList.remove("hidden");
      resultsViewEl?.classList.add("hidden");
      setSubmitDisabled(true);
      return;
    }

    if (state === "result") {
      vulykForm.classList.add("hidden");
      loadingEl?.classList.add("hidden");
      resultsViewEl?.classList.remove("hidden");
      setSubmitDisabled(false);
      return;
    }
  }

  function validateInputForStyling(input) {
    // Don't show "invalid" styling for untouched/empty fields
    if (input.value === "") {
      input.classList.remove("invalid");
      return true;
    }

    if (input.checkValidity()) {
      input.classList.remove("invalid");
      return true;
    }

    input.classList.add("invalid");
    return false;
  }

  function validateAllInputsForSubmit() {
    let allValid = true;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      // On submit, empty values should be treated as invalid.
      if (!input.checkValidity() || input.value === "") {
        input.classList.add("invalid");
        allValid = false;
        continue;
      }

      input.classList.remove("invalid");
    }

    return allValid;
  }

  function renderNoResults() {
    if (!resultsEl) return;

    const responseText = `
      <h2 class="text-big mb-8">Результати запиту</h2>
      <p class="text-regular mb-12">Послуги не знайдено</p>
    `;

    resultsEl.innerHTML = responseText;
    resultsViewEl?.scrollIntoView({ block: "start" });
  }

  function renderResults(response) {
    if (!resultsEl) return;

    resultsEl.innerHTML = "";

    if (response == null || response.code == "EmptyResult") {
      renderNoResults();
      return;
    }

    let service_status = "";
    switch (response.status) {
      case "Draft":
        service_status = "Чернетка";
        break;
      case "Registered":
        service_status = "Зареєстрована";
        break;
      case "SubmitedToCNAP":
        service_status = "Подано до ЦНАП";
        break;
      case "OnProcessingSNAP":
        service_status = "На обробці ЦНАП";
        break;
      case "ResultPrepared":
        service_status = "Результат підготовлено";
        break;
      case "ApplicantNoted":
        service_status = "Сповіщено заявника";
        break;
      case "ApplicantNotedButNotReceived":
        service_status = "Сповіщено заявника, але не отримано";
        break;
      case "Closed":
        service_status = "Закрито";
        break;
      case "ClosedWithoutResult":
        service_status = "Закрито без результату";
        break;
      default:
        service_status = response.status;
        console.log("Unknown vulyk status: ", response.status);
        break;
    }

    let service_state = "";
    switch (response.state) {
      case "Premature":
        service_state = "Актуальна";
        break;
      case "ApproachingDeadline":
        service_state = "Наближається термін виконання";
        break;
      case "Overdue":
        service_state = "Протермінована";
        break;
      default:
        service_state = response.state;
        console.log("Unknown vulyk state: ", response.state);
        break;
    }

    const responseText = `
      <div class="flex flex-col">
            <h2 class="text-big mb-2">Результати запиту</h2>
            <p class="text-regular font-extralight">Статус обробки вашої заяви</p>
            <p class="text-regular font-light mt-10 mb-2">Статус</p>
            <p class="text-medium">${service_status}</p>

            <p class="text-regular font-light mt-10 mb-2">Термін</p>
            <p class="text-medium mb-10">${service_state}</p>
        </div>
    `;

    resultsEl.innerHTML = responseText;
    resultsViewEl?.scrollIntoView({ block: "start" });
  }

  function requestVulykData() {
    const numberInput = document.getElementsByName("number")[0];
    const pinInput = document.getElementsByName("pin")[0];

    const number = numberInput ? numberInput.value : "";
    const password = pinInput ? pinInput.value : "";

    setState("loading");

    const xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      // Success
      if (this.status === 200) {
        let response = null;
        try {
          response = JSON.parse(this.responseText);
        } catch (e) {
          console.log("Failed to parse vulyk response:", e);
          setState("result");
          renderNoResults();
          return;
        }

        setState("result");
        renderResults(response);
        return;
      }

      // Errors
      setState("result");
      renderNoResults();
    };

    xmlhttp.onerror = function () {
      setState("result");
      renderNoResults();
    };

    xmlhttp.open("POST", `https://api.toolkit.in.ua/getVulykData`, true);
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xmlhttp.send(
      JSON.stringify({
        number,
        password,
      })
    );
  }

  // Live validation styling
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (e) => {
      validateInputForStyling(e.target);
    });

    inputs[i].addEventListener("input", (e) => {
      validateInputForStyling(e.target);
    });
  }

  reloadButton?.addEventListener("click", () => {
    window.location.reload();
  });

  // Submit-driven behaviour
  vulykForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validateAllInputsForSubmit();
    if (!ok) return;

    requestVulykData();
  });

  // Ensure initial state
  setState("form");
}

// Auto-init if the module is loaded on a page that contains the form
window.addEventListener("load", () => {
  initVulykForm();
});
