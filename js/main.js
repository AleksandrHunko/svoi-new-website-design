import { initNav, initMenuToggle, initAccessibilityDialog, initSearchDialog, initFloatingMenu } from './nav.js';
import { validateInputs } from './validate-inputs.js';

import { initViewToggle } from './toggle-view.js'
import { initSliders } from './slider-control.js'
import { galleryInit } from './gallery.js';

import { filterMenuInit } from './filter-menu.js'
import { initAccordionMenu } from './misc-elements.js'
import { initEcomonitoringVidget } from './ecomonitoring-vidget.js'


window.addEventListener('load', () => {
  initNav();
  initMenuToggle();
  initAccessibilityDialog();
  initSearchDialog();
  initFloatingMenu();

  validateInputs();

  initSliders();

  galleryInit();
  filterMenuInit();
  initAccordionMenu();
  initViewToggle()
  initEcomonitoringVidget()

  document.querySelector('.copyright-year').innerHTML = `toolkit.in.ua ${new Date().getFullYear()}. Всі права захищені.`
});