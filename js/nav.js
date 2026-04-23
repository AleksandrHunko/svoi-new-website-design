export function initNav() {
    const container = document.querySelector('.nav-desktop-top');
    if (!container) return;

    const items = container.querySelectorAll('a');

    function updateNav() {
        const screenWidth = window.innerWidth;

        if (screenWidth < 768) {
            items.forEach(item => item.style.display = 'none');
            return;
        }

        items.forEach(item => {
            if (item.classList.contains('menuToggle')) return;
            item.style.display = 'block'; // reset first
            const itemRight = item.offsetLeft + item.offsetWidth;
            if (itemRight > screenWidth - 250) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
    }

    window.addEventListener('resize', updateNav);
    updateNav();
}


export function initMenuToggle() {
    const menu = document.querySelector(".mobile-menu");
    if (!menu) return;
    const menuToggles = document.querySelectorAll(".menuToggle");
    const menuClose = menu.querySelector(".menu-close");
    let menuOpen = false;

    function openMenu() {
        menuOpen = true;
        menu.classList.remove("opacity-0", "pointer-events-none");
        menu.classList.add("opacity-100", "pointer-events-auto");
        document.querySelector('.nav-desktop-top').querySelectorAll('a').forEach(item => {
            item.style.display = 'none';
        });
    }

    function closeMenu() {
        menuOpen = false;
        menu.classList.add("opacity-0", "pointer-events-none");
        menu.classList.remove("opacity-100", "pointer-events-auto");
        menuToggles.forEach(toggle => {
            const checkbox = toggle.querySelector("input");
            if (checkbox) checkbox.checked = false;
        });
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) return;
        document.querySelector('.nav-desktop-top').querySelectorAll('a').forEach(item => {
            item.style.display = 'block';
            if (item.classList.contains('menuToggle')) return;
            const itemRight = item.offsetLeft + item.offsetWidth;
            if (itemRight > screenWidth - 250) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
    }

    for (const toggle of menuToggles) {
        const checkbox = toggle.querySelector("input");
        if (checkbox) {
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    openMenu();
                } else {
                    closeMenu();
                }
            });
        } else {
            toggle.addEventListener("click", (e) => {
                e.preventDefault();
                if (menuOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
        }
    }

    if (menuClose) {
        menuClose.addEventListener("click", () => {
            closeMenu();
        });
    }
}

export function initAccessibilityDialog() {
    const dialog = document.querySelector("#accessibility-dialog");
    if (!dialog) return;

    if (document.cookie.split('; ').find(row => row.startsWith('enable-contrast'))) {
        document.querySelector('body').classList.add('color-style-contrast')
    }

    const zoomSteps = [90, 100, 110, 125, 150];
    let currentZoomIndex = 1;

    if (document.cookie.split('; ').find(row => row.startsWith('zoom'))) {
        const zoomCookie = document.cookie.split('; ').find(row => row.startsWith('zoom'))
        currentZoomIndex = parseInt(zoomCookie.split("=")[1]) || 1
        document.querySelector("body").classList.add(`zoom-${zoomSteps[currentZoomIndex]}`)
        dialog.querySelector("#scale-value").innerHTML = zoomSteps[currentZoomIndex] / 100 + 'x'
    }

    if (document.cookie.split('; ').find(row => row.startsWith('underscore-links'))) {
        document.querySelector('body').classList.add('underscore-links')
        dialog.querySelector('.underscore-links').querySelector(".checkmark").classList.add("visible")
        dialog.querySelector('.underscore-links').querySelector(".checkmark").classList.remove("invisible")
    }

    document.querySelector('#accessibility-button-open')?.addEventListener('click', () => {
        dialog.showModal();
    });
    document.querySelector('#accessibility-button-close')?.addEventListener('click', () => {
        dialog.close();
    });

    dialog.querySelector('.color-enable')?.addEventListener('click', () => {
        document.querySelector("body").classList.remove("color-style-contrast")
        document.cookie = "enable-contrast=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    })
    dialog.querySelector('.color-disable')?.addEventListener('click', () => {
        document.querySelector("body").classList.add("color-style-contrast")
        document.cookie = "enable-contrast=true; path=/;";
    })


    dialog.querySelector('.scale-up')?.addEventListener('click', () => {
        document.querySelector("body").classList.remove(`zoom-${zoomSteps[currentZoomIndex]}`)
        currentZoomIndex = Math.min(currentZoomIndex + 1, zoomSteps.length - 1)
        document.querySelector("body").classList.add(`zoom-${zoomSteps[currentZoomIndex]}`)
        document.cookie = `zoom=${currentZoomIndex}; path=/;`;
        dialog.querySelector("#scale-value").innerHTML = zoomSteps[currentZoomIndex] / 100 + 'x'
    })

    dialog.querySelector('.scale-down')?.addEventListener('click', () => {
        document.querySelector("body").classList.remove(`zoom-${zoomSteps[currentZoomIndex]}`)
        currentZoomIndex = Math.max(currentZoomIndex - 1, 0)
        document.querySelector("body").classList.add(`zoom-${zoomSteps[currentZoomIndex]}`)
        document.cookie = `zoom=${currentZoomIndex}; path=/;`;
        dialog.querySelector("#scale-value").innerHTML = zoomSteps[currentZoomIndex] / 100 + 'x'
    })

    dialog.querySelector('.underscore-links')?.addEventListener('click', () => {
        if (document.querySelector("body").classList.contains("underscore-links")) {
            document.querySelector("body").classList.remove("underscore-links")
            dialog.querySelector('.underscore-links').querySelector(".checkmark").classList.remove("visible")
            dialog.querySelector('.underscore-links').querySelector(".checkmark").classList.add("invisible")
            document.cookie = "underscore-links=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } else {
            document.querySelector("body").classList.add("underscore-links")
            dialog.querySelector('.underscore-links').querySelector(".checkmark").classList.add("visible")
            dialog.querySelector('.underscore-links').querySelector(".checkmark").classList.remove("invisible")
            document.cookie = "underscore-links=true; path=/;";
        }  
    })
}

export function initFloatingMenu() {
    const toggle = document.querySelector('#floating-menu-toggle');
    const items = document.querySelector('#floating-menu-items');
    const iconOpen = document.querySelector('#floating-icon-hamburger');
    const iconClose = document.querySelector('#floating-icon-close');
    if (!toggle || !items) return;

    let isOpen = false;

    function openMenu() {
        isOpen = true;
        items.style.display = 'flex';
        items.offsetHeight; // force reflow so transition fires
        items.classList.add('open');
        toggle.classList.add('open');
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
    }

    function closeMenu() {
        isOpen = false;
        items.classList.remove('open');
        toggle.classList.remove('open');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        setTimeout(() => { if (!isOpen) items.style.display = 'none'; }, 300);
    }

    toggle.addEventListener('click', () => {
        if (isOpen) closeMenu(); else openMenu();
    });

    document.addEventListener('click', (e) => {
        if (isOpen && !document.querySelector('#floating-context-menu').contains(e.target)) {
            closeMenu();
        }
    });
}

export function initSearchDialog() {
    const dialog = document.querySelector("#search-dialog");
    if (!dialog) return
    document.querySelector('#search-button-open')?.addEventListener('click', () => {
        let search_opened = dialog.open ? true : false
        if (!search_opened) {
            dialog.show();
            return
        }
        dialog.close()
    });

    document.querySelector('#search-button-close')?.addEventListener('click', () => {
        dialog.close()
    });
}
