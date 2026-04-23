export function filterMenuInit() {
    initClearButton()
    changeIconOnOpen()
    addTagStyling()
}

function initClearButton() {
    const form = document.querySelector(".filter-form")
    if (!form) return
    const clearButton = form.querySelector(".button-filter-clear")
    if (!clearButton) return

    clearButton.addEventListener('click', () => {
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:not(.hidden)');

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    })
}

function changeIconOnOpen() {
    const form = document.querySelector(".filter-form")
    if (!form) return
    const filterToggle = form.querySelector("#filter-toggle")
    if (!filterToggle) return

    if (filterToggle.checked) {
        form.querySelector(".filter-closed").classList.add("hidden")
        form.querySelector(".filter-open").classList.remove("hidden")
    } else {
        form.querySelector(".filter-closed").classList.remove("hidden")
        form.querySelector(".filter-open").classList.add("hidden")
    }

    filterToggle.addEventListener("change", () => {
        if (filterToggle.checked) {
            form.querySelector(".filter-closed").classList.add("hidden")
            form.querySelector(".filter-open").classList.remove("hidden")
        } else {
            form.querySelector(".filter-closed").classList.remove("hidden")
            form.querySelector(".filter-open").classList.add("hidden")
        }
    })
}

function addTagStyling() {
    const form = document.querySelector(".filter-form")
    if (!form) return

    const labelsToStyle = form.querySelectorAll(".label-tag")

    function updateLabelClasses() {
        labelsToStyle.forEach(label => {
            const attrValue = label.getAttribute('for');
            const checkbox = form.querySelector(`input[type="checkbox"][id="${attrValue}"]`);
            
            if (checkbox && checkbox.checked) {
                label.classList.remove("bg-colored-80");
                label.classList.remove("border-transparent");
                label.classList.add("border-black");
            } else {
                label.classList.add("bg-colored-80");
                label.classList.add("border-transparent");
                label.classList.remove("border-black");
            }
        });
    }

    form.querySelectorAll('input[type="checkbox"]:not(.hidden)').forEach(checkbox => {
        checkbox.addEventListener('change', updateLabelClasses);
    });

    updateLabelClasses();

}