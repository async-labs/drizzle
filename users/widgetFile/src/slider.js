function hideAndShow(images, currentIndex) {
  images.forEach((img, i) => {
    if (currentIndex === i) {
      img.style.display = 'block';
    } else {
      img.style.display = 'none';
    }
  });
}

function startSlider(slider) {
  const images = [...slider.children];

  slider.dataset.interval = setInterval(() => {
    let currentIndex = Number(slider.dataset.currentIndex) || 0;
    currentIndex = (currentIndex + 1) % images.length;

    hideAndShow(images, currentIndex);
    slider.dataset.currentIndex = currentIndex;
  }, 1000);


  let currentIndex = Number(slider.dataset.currentIndex) || 0;
  currentIndex = (currentIndex + 1) % images.length;
  slider.dataset.currentIndex = currentIndex;

  hideAndShow(images, Number(slider.dataset.currentIndex) || 0);
}

export function handleSlider() {
  const slider = document.querySelector('.drizzle--wall-slider');
  if (!slider) { return; }

  slider.addEventListener('mouseenter', () => {
    if (slider.dataset.started) {
      return;
    }

    startSlider(slider);
  });

  slider.addEventListener('mouseleave', () => {
    if (!slider.dataset.interval) {
      return;
    }

    clearInterval(slider.dataset.interval);
    slider.dataset.interval = '';
  });
}
