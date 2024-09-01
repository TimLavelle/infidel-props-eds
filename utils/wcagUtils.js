export function handleDropdownButtonKeydown(event, toggleDropdown, closeDropdown) {
    if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === 'Escape') {
      closeDropdown();
    }
  }
  
  export function handleDropdownOptionKeydown(event, options, selectOption, closeDropdown, focusButton) {
    const currentIndex = options.indexOf(event.target);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < options.length - 1) options[currentIndex + 1].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) options[currentIndex - 1].focus();
        else { focusButton(); closeDropdown(); }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectOption(event.target);
        break;
      case 'Escape':
      case 'Tab':
        focusButton();
        closeDropdown();
        break;
    }
  }
  
  export function attachDropdownEventListeners(button, listbox, toggleDropdown, selectOption, closeDropdown) {
    button.addEventListener('click', toggleDropdown);
    button.addEventListener('keydown', (event) => handleDropdownButtonKeydown(event, toggleDropdown, closeDropdown));
  
    listbox.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', () => selectOption(option));
      option.addEventListener('keydown', (event) => handleDropdownOptionKeydown(event, [...listbox.children], selectOption, closeDropdown, () => button.focus()));
    });
  }
  
  export function addOutsideClickListener(element, callback) {
    document.addEventListener('click', (event) => {
      if (!element.contains(event.target)) callback();
    });
  }