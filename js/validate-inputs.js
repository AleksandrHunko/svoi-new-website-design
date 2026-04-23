export function validateInputs() {
    const inputs = document.querySelectorAll(".styled-input");
    if (inputs.length > 0) {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].querySelector('input').addEventListener('change', function () {
                if (this.value == "") {
                    this.classList.remove('valid')
                } else {
                    this.classList.add('valid')
                }
            })
        }
    }
}