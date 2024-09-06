import BlockUtils from '../../utils/blockUtils.js';
import { fetchAuPorts, fetchAndUpdateDeals } from '../../utils/dealUtils.js';

export class FlightDeals {
  constructor(block, childElements) {
    this.block = block;
    this.childElements = childElements;
    this.blockUtils = new BlockUtils(block, childElements);
    this.params = {};
    this.titleElement = null;
    this.listbox = null;
    this.button = null;
    this.dealsContainer = null;
  }

  async decorate() {
    this.setupParams();
    await this.setupTitleElement();
    this.setupDealsContainer();
    await this.fetchAndUpdateDeals();
  }

  setupParams() {
    const fields = ['fromPort', 'showDisclaimers', 'saleName', 'toPorts', 'travelClass', 'showDealImages', 'title'];
    const params = fields.reduce((acc, key) => {
      const value = this.blockUtils.getTrimmedContent(key);
      if (value) acc[key] = value;
      return acc;
    }, {});

    this.params = params;
  }

  createDealsAPIParams(fromPort) {
    const destinationParams = this.params.toPorts?.split(',')
      .map((toPort) => `&destination=${toPort.trim()}:${this.params.travelClass}`)
      .join('') || '';
    const saleNameParams = this.params.saleName?.split(',')
      .map((sale) => `&saleName=${sale.trim()}`)
      .join('') || '';
    return `?departureAirport=${fromPort}&includeDisclaimers=${this.params.showDisclaimers}${saleNameParams}${destinationParams}`;
  }

  async setupTitleElement() {
    const auPorts = await fetchAuPorts();
    const titleElement = document.createElement('div');
    titleElement.className = 'deals-title-container dropdown-container';

    const selectedPort = auPorts.flightDeals.model.departures.find(
      (port) => port.cityCode === this.params.fromPort,
    );

    titleElement.innerHTML = `
      <label for="destination-button" class="deals-title">${this.params.title}</label>
      <button id="destination-button" aria-haspopup="listbox" aria-expanded="false">
        ${selectedPort ? selectedPort.cityName : 'Select a city'}
        <span class="dropdown-arrow" aria-hidden="true">▼</span>
      </button>
      <ul id="destination-listbox" role="listbox" aria-label="Destination list"></ul>
    `;

    this.titleElement = titleElement;
    this.listbox = titleElement.querySelector('#destination-listbox');
    this.button = titleElement.querySelector('#destination-button');
  }

  populateListbox() {
    this.listbox.innerHTML = auPorts.flightDeals.model.departures.map((port) => `
      <li role="option" tabindex="-1" data-value="${port.cityCode}">${port.cityName}</li>
    `).join('');
  }

  toggleDropdown() {
    const expanded = this.button.getAttribute('aria-expanded') === 'true';
    this.button.setAttribute('aria-expanded', !expanded);
    this.listbox.style.display = expanded ? 'none' : 'block';
    if (!expanded) this.listbox.querySelector('li').focus();
  }

  closeDropdown() {
    this.button.setAttribute('aria-expanded', 'false');
    this.listbox.style.display = 'none';
  }

  handleButtonKeydown(event) {
    if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.toggleDropdown();
    } else if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  attachEventListeners() {
    this.button.addEventListener('click', this.toggleDropdown);
    this.button.addEventListener('keydown', this.handleButtonKeydown);

    this.listbox.querySelectorAll('li').forEach((option) => {
      /* eslint-disable no-use-before-define */
      option.addEventListener('click', () => this.selectOption(option));
      option.addEventListener('keydown', this.handleOptionKeydown);
      /* eslint-enable no-use-before-define */
    });
  }

  async selectOption(option) {
    const selectedCityCode = option.dataset.value;
    this.button.innerHTML = `${option.textContent}<span class="dropdown-arrow" aria-hidden="true">▼</span>`;
    this.button.focus();
    this.closeDropdown();

    this.params.fromPort = selectedCityCode;
    await fetchAndUpdateDeals(this.createDealsAPIParams(selectedCityCode), this.block, this.params);

    this.populateListbox();
    this.attachEventListeners();
  }

  handleOptionKeydown(event) {
    const options = [...this.listbox.children];
    const currentIndex = options.indexOf(event.target);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < options.length - 1) options[currentIndex + 1].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) options[currentIndex - 1].focus();
        else { this.button.focus(); this.closeDropdown(); }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectOption(event.target);
        break;
      case 'Escape':
      case 'Tab':
        this.button.focus();
        this.closeDropdown();
        break;
      default:
        event.preventDefault();
        this.button.focus();
        this.closeDropdown();
        break;
    }
  }

  setupDealsContainer() {
    this.dealsContainer = document.createElement('div');
    this.dealsContainer.className = 'deals-container';
    this.block.appendChild(this.dealsContainer);
  }

  async fetchAndUpdateDeals() {
    await fetchAndUpdateDeals(this.createDealsAPIParams(this.params.fromPort), this.dealsContainer, this.params);
  }
}

export default async function decorate(block) {
  const childElements = [
    { key: 'title', className: 'deals-title' },
    { key: 'showDealImages', className: 'deals-show-deal-images' },
    { key: 'fromPort', className: 'deals-from-port' },
    { key: 'toPorts', className: 'deals-to-ports' },
    { key: 'travelClass', className: 'deals-travel-class' },
    { key: 'saleName', className: 'deals-sale-name' },
    { key: 'showDisclaimers', className: 'deals-show-disclaimers' },
  ];

  const flightDeals = new FlightDeals(block, childElements);
  await flightDeals.decorate();
}
