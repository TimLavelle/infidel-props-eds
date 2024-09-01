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

  const createDealsAPIParams = (fromPort) => {
    const destinationParams = params.toPorts?.split(',')
      .map(toPort => `&destination=${toPort.trim()}:${params.travelClass}`)
      .join('') || '';
    const saleNameParams = params.saleName?.split(',')
      .map(sale => `&saleName=${sale.trim()}`)
      .join('') || '';
    return `?departureAirport=${fromPort}&includeDisclaimers=${params.showDisclaimers}${saleNameParams}${destinationParams}`;
  };

  const auPorts = await fetchAuPorts();
  const titleElement = document.createElement('div');
  titleElement.className = 'deals-title-container dropdown-container';

  const selectedPort = auPorts.flightDeals.model.departures.find(port => port.cityCode === params.fromPort);

  titleElement.innerHTML = `
    <label for="destination-button" class="deals-title">${params.title}</label>
    <button id="destination-button" aria-haspopup="listbox" aria-expanded="false">
      ${selectedPort ? selectedPort.cityName : 'Select a city'}
      <span class="dropdown-arrow" aria-hidden="true">▼</span>
    </button>
    <ul id="destination-listbox" role="listbox" aria-label="Destination list"></ul>
  `;

  const listbox = titleElement.querySelector('#destination-listbox');
  const button = titleElement.querySelector('#destination-button');

  const populateListbox = () => {
    listbox.innerHTML = auPorts.flightDeals.model.departures.map(port => `
      <li role="option" tabindex="-1" data-value="${port.cityCode}">${port.cityName}</li>
    `).join('');
  };

  const toggleDropdown = () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    listbox.style.display = expanded ? 'none' : 'block';
    if (!expanded) listbox.querySelector('li').focus();
  };

  const closeDropdown = () => {
    button.setAttribute('aria-expanded', 'false');
    listbox.style.display = 'none';
  };

  const selectOption = async (option) => {
    const selectedCityCode = option.dataset.value;
    button.innerHTML = `${option.textContent}<span class="dropdown-arrow" aria-hidden="true">▼</span>`;
    button.focus();
    closeDropdown();

    params.fromPort = selectedCityCode;
    await fetchAndUpdateDeals(createDealsAPIParams(selectedCityCode), block, params);
    
    populateListbox();
    attachEventListeners();
  };

  const handleButtonKeydown = (event) => {
    if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === 'Escape') {
      closeDropdown();
    }
  };

  const handleOptionKeydown = (event) => {
    const options = [...listbox.children];
    const currentIndex = options.indexOf(event.target);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < options.length - 1) options[currentIndex + 1].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) options[currentIndex - 1].focus();
        else { button.focus(); closeDropdown(); }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectOption(event.target);
        break;
      case 'Escape':
      case 'Tab':
        button.focus();
        closeDropdown();
        break;
    }
  };

  const attachEventListeners = () => {
    button.addEventListener('click', toggleDropdown);
    button.addEventListener('keydown', handleButtonKeydown);

    listbox.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', () => selectOption(option));
      option.addEventListener('keydown', handleOptionKeydown);
    });
  };

  document.addEventListener('click', (event) => {
    if (!titleElement.contains(event.target)) closeDropdown();
  });

  populateListbox();
  attachEventListeners();

  block.insertBefore(titleElement, block.firstChild);
  
  const dealsContainer = document.createElement('div');
  dealsContainer.className = 'deals-container';
  block.appendChild(dealsContainer);
  
  await fetchAndUpdateDeals(createDealsAPIParams(params.fromPort), dealsContainer, params);
}