export function handleDropdown() {
  const dropdownToggle = document.querySelector('.zenmarket--dropdown-toggle');
  const btnGroup = document.querySelector('.zenmarket--btn-group');

  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', () => {
      btnGroup.classList.toggle('zenmarket--open');
    });

    // If dropdown is open, close when clicking outside.
    document.addEventListener('click', (event) => {
      if (
        event.target !== dropdownToggle &&
        event.target !== dropdownToggle.querySelector('span')
      ) {
        btnGroup.classList.remove('zenmarket--open');
      }
    });
  }
}
