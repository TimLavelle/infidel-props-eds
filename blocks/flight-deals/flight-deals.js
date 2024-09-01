import { BlockUtils } from '../../utils/blockUtils.js';
import { fetchAuPorts, fetchAndUpdateDeals } from '../../utils/dealUtils.js';

export default async function decorate(block) {
  const childElements = [
    { key: 'title', className: 'deals-title' },
    { key: 'showDealImages', className: 'deals-show-deal-images' },
    { key: 'fromPort', className: 'deals-from-port' },
    { key: 'toPorts', className: 'deals-to-ports' },
    { key: 'travelClass', className: 'deals-travel-class' },
    { key: 'saleName', className: 'deals-sale-name' },
    { key: 'showDisclaimers', className: 'deals-show-disclaimers' }
  ];

  const blockUtils = new BlockUtils(block, childElements);
  blockUtils.removeUtilityElements(['showDealImages', 'showDisclaimers', 'saleName', 'fromPort', 'travelClass', 'toPorts', 'title']);

  const fields = ['fromPort', 'showDisclaimers', 'saleName', 'toPorts', 'travelClass', 'showDealImages', 'title'];
  const params = fields.reduce((acc, key) => {
    const value = blockUtils.getTrimmedContent(key);
    if (value) acc[key] = value;
    return acc;
  }, {});

  const destinationParams = params.toPorts?.split(',')
    .map(toPort => `&destination=${toPort.trim()}:${params.travelClass}`)
    .join('') || '';

  const saleNameParams = params.saleName?.split(',')
    .map(sale => `&saleName=${sale.trim()}`)
    .join('') || '';

  const createDealsAPIParams = (fromPort) => `?departureAirport=${fromPort}&includeDisclaimers=${params.showDisclaimers}${saleNameParams}${destinationParams}`;

  const auPorts = await fetchAuPorts();
  const titleElement = document.createElement('div');
  titleElement.className = 'deals-title-container dropdown-container';

  const selectedPort = auPorts.flightDeals.model.departures.find(port => port.cityCode === params.fromPort);
  
  const createListItem = (port) => {
    const liListbox  = document.createElement('li');
    liListbox.setAttribute('role', 'option');
    liListbox.setAttribute('tabindex', '-1');
    liListbox.dataset.value = port.cityCode;
    liListbox.textContent = port.cityName;
    return liListbox;
  };

  titleElement.innerHTML = `
    <label for="destination-button" class="deals-title">${params.title}</label>
    <button id="destination-button" aria-haspopup="listbox" aria-expanded="false">
      ${selectedPort ? selectedPort.cityName : 'Select a city'}
      <span class="dropdown-arrow">▼</span>
    </button>
    <ul id="destination-listbox" role="listbox" aria-label="Destination list"></ul>
  `;

  const listbox = titleElement.querySelector('#destination-listbox');
  auPorts.flightDeals.model.departures.forEach(port => {
    listbox.appendChild(createListItem(port));
  });

  const button = titleElement.querySelector('#destination-button');
  const options = listbox.querySelectorAll('li');

  function toggleDropdown() {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    listbox.style.display = expanded ? 'none' : 'block';
    if (!expanded) {
      options[0].focus();
    }
  }

  function closeDropdown() {
    button.setAttribute('aria-expanded', 'false');
    listbox.style.display = 'none';
  }

  async function selectOption(option) {
    const selectedCityCode = option.dataset.value;
    button.textContent = option.textContent;
    button.appendChild(createDropdownArrow());
    button.focus();
    closeDropdown();

    params.fromPort = selectedCityCode;
    const newDealsAPIParams = createDealsAPIParams(selectedCityCode);
    await fetchAndUpdateDeals(newDealsAPIParams, block, params);
  }

  function handleButtonKeydown(event) {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleDropdown();
        break;
      case 'Escape':
        closeDropdown();
        break;
    }
  }

  function handleOptionKeydown(event) {
    const currentIndex = Array.from(options).indexOf(event.target);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < options.length - 1) {
          options[currentIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          options[currentIndex - 1].focus();
        } else {
          button.focus();
          closeDropdown();
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectOption(event.target);
        break;
      case 'Escape':
        button.focus();
        closeDropdown();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  }

  function createDropdownArrow() {
    const arrow = document.createElement('span');
    arrow.className = 'dropdown-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '▼';
    return arrow;
  }

  button.addEventListener('click', toggleDropdown);
  button.addEventListener('keydown', handleButtonKeydown);

  options.forEach(option => {
    option.addEventListener('click', () => selectOption(option));
    option.addEventListener('keydown', handleOptionKeydown);
  });

  document.addEventListener('click', (event) => {
    if (!button.contains(event.target) && !listbox.contains(event.target)) {
      closeDropdown();
    }
  });

  block.insertBefore(titleElement, block.firstChild);
  
  const dealsContainer = document.createElement('div');
  dealsContainer.className = 'deals-container';
  block.appendChild(dealsContainer);
  
  const initialDealsAPIParams = createDealsAPIParams(params.fromPort);
  await fetchAndUpdateDeals(initialDealsAPIParams, dealsContainer, params);
}