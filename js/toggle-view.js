export function initViewToggle() {
    const toggleContainer = document.querySelector(".toggle-view")
    if (!toggleContainer) return

    // grid is default
    toggleContainer.classList.add("view-grid")

    // if contrast is enabled, list is default
    if (document.cookie.split('; ').find(row => row.startsWith('enable-contrast'))) {
        toggleContainer.classList.remove("view-grid")
        toggleContainer.classList.add("view-list")
    }

    const toggleListView = document.querySelector(".toggle-view-list")
    if (!toggleListView) return
    const toggleGridView = document.querySelector(".toggle-view-grid")
    if (!toggleGridView) return

    toggleGridView.addEventListener('click', () => {
        toggleContainer.classList.add("view-grid")
        toggleContainer.classList.remove("view-list")
    })

    toggleListView.addEventListener('click', () => {
        toggleContainer.classList.add("view-list")
        toggleContainer.classList.remove("view-grid")
    })

}