export function handleTabs() {
  const tabItems = [...document.querySelectorAll('.zenmarket--tab-list li')];

  tabItems.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabItems.forEach((tabItem) => tabItem.classList.remove('zenmarket--tabs-active'));

      tab.classList.add('zenmarket--tabs-active');

      [...document.querySelectorAll('.zenmarket--tab-panels > li')].forEach(item => {
        item.style.display = 'none';
      });

      document.querySelector(
        `.zenmarket--tab-panels > li:nth-child(${index + 1})`
      ).style.display = 'block';
    });
  });
}
