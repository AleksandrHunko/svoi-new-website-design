export function initSliders() {
  function getCurrentIndex(container, items) {
    const scrollLeft = container.scrollLeft;
    let closestIndex = 0;
    let minDistance = 99999;

    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - scrollLeft);
      if (distance < minDistance && distance >= 0) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  const sliderControls = document.querySelectorAll(".slider-control-dots")
  for (let i = 0; i < sliderControls.length; i++) {
    const container = document.getElementById(sliderControls[i].dataset.target)
    const dots = sliderControls[i].querySelectorAll("span")
    const items = Array.from(container.children);

    // Update active dot on scroll
    container.addEventListener("scroll", () => {
      const atStart = container.scrollLeft <= 1;
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

      // reset dots
      dots.forEach(dot => {
        dot.classList.add("bg-(--theme-bg-80)") 
        dot.classList.remove("bg-black")
      });

      if (atStart) {
        dots[0].classList.add("bg-black")
        dots[0].classList.remove("bg-(--theme-bg-80)")
        return
      }
      if (atEnd) {
        dots[2].classList.add("bg-black")
        dots[2].classList.remove("bg-(--theme-bg-80)")
        return
      }
      dots[1].classList.add("bg-black")
      dots[1].classList.remove("bg-(--theme-bg-80)")
    });

    // add slider control
    dots[2].addEventListener('click', () => {
      const current = getCurrentIndex(container, items);
      let next = Math.min(current + 1, items.length - 1);
      // check if next is in the same column, choose another one if so
      while (items[next].offsetLeft == items[current].offsetLeft && next < items.length - 1) next++

      items[next].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });

    dots[1].addEventListener('click', () => {
      const atStart = container.scrollLeft <= 1;
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
      if (atStart) {
        const current = getCurrentIndex(container, items);
        let next = Math.min(current + 1, items.length - 1);
        // check if next is in the same column, choose another one if so
        while (items[next].offsetLeft == items[current].offsetLeft && next < items.length - 1) next++

        items[next].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        return
      }
      if (atEnd) {
        const current = getCurrentIndex(container, items);
        let prev = Math.max(current - 1, 0);
        // check if prev is in the same column, choose another one if so
        while (items[prev].offsetLeft == items[current].offsetLeft && prev > 0) prev--
        items[prev].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        return
      }
    });

    dots[0].addEventListener('click', () => {
      const current = getCurrentIndex(container, items);
      let prev = Math.max(current - 1, 0);
      // check if prev is in the same column, choose another one if so
      while (items[prev].offsetLeft == items[current].offsetLeft && prev > 0) prev--
      items[prev].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });

  }



  const sliderArrows = document.querySelectorAll(".slider-control-arrows")
  for (let i = 0; i < sliderArrows.length; i++) {
    const container = document.getElementById(sliderArrows[i].dataset.target)
    
    const arrows = sliderArrows[i].querySelectorAll("svg")
    
    const items = Array.from(container.children);

    // Update active arrow on scroll
    container.addEventListener("scroll", () => {
      const atStart = container.scrollLeft <= 1;
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

      // reset arrrows
      arrows.forEach(arrow => {
        arrow.classList.add("cursor-pointer") 
        arrow.style.fill = "black"
      });

      if (atStart) {
        arrows[0].classList.remove("cursor-pointer") 
        arrows[0].style.fill = "#959595"
        return
      }
      if (atEnd) {
        arrows[1].classList.remove("cursor-pointer") 
        arrows[1].style.fill = "#959595"
        return
      }
    });

    // add slider control
    arrows[1].addEventListener('click', () => {
      const current = getCurrentIndex(container, items);
      let next = Math.min(current + 1, items.length - 1);

      // check if next is in the same column, choose another one if so
      while (items[next].offsetLeft == items[current].offsetLeft && next < items.length - 1) next++
      
      items[next].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });

    arrows[0].addEventListener('click', () => {
      const current = getCurrentIndex(container, items);
      let prev = Math.max(current - 1, 0);
      // check if prev is in the same column, choose another one if so
      while (items[prev].offsetLeft == items[current].offsetLeft && prev > 0) prev--
      items[prev].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });

  }
}