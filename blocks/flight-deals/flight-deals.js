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
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.setAttribute('tabindex', '0');
    li.dataset.value = port.cityCode;
    li.textContent = port.cityName;
    return li;
  };

  titleElement.innerHTML = `
    <label for="destination-select" class="deals-title">${params.title}</label>
    <button aria-haspopup="listbox" aria-expanded="false" id="destination-button">
      ${selectedPort ? selectedPort.cityName : 'Select a city'}
    </button>
    <ul id="destination-listbox" role="listbox" aria-label="Destination list" tabindex="-1"></ul>
  `;

  const listbox = titleElement.querySelector('#destination-listbox');
  auPorts.flightDeals.model.departures.forEach(port => {
    listbox.appendChild(createListItem(port));
  });

  const citySelector = titleElement.querySelector('#citySelector');
  citySelector.addEventListener('change', async (event) => {
    const selectedCityCode = event.target.value;
    params.fromPort = selectedCityCode;
    const newDealsAPIParams = createDealsAPIParams(selectedCityCode);
    await fetchAndUpdateDeals(newDealsAPIParams, block, params);
  });
  block.insertBefore(titleElement, block.firstChild);
  
  const initialDealsAPIParams = createDealsAPIParams(params.fromPort);
  await fetchAndUpdateDeals(initialDealsAPIParams, block, params);
}