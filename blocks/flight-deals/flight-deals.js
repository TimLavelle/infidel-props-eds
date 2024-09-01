import { BlockUtils } from '../../utils/blockUtils.js';

const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers';
const flightImage = 'https://tims-personal-stuff.s3.ap-southeast-2.amazonaws.com/poolside-beach-chairs-jamaica.jpg';

async function fetchAuPorts() {
  const response = await fetch('../../utils/resources/auPorts.json');
  return response.json();
}

function createDealElement(offer, params, link) {
  const li = document.createElement('li');
  li.className = 'deal-item';
  li.innerHTML = `
    <div class="flight-deal-card">
      <a href="${link || offer.deepLink}" aria-label="Flight deal to ${offer.route.to.name}: ${offer.travelClass.toLowerCase()} ${offer.tripType.toLowerCase().replace(/_/g, ' ')} from ${offer.price.symbol}${offer.price.amountFormatted}" tabindex="0">
        ${params.showDealImages === 'true' && flightImage ? `<div class="flight-deal-image-container"><img src="${flightImage}" alt="" role="presentation" class="flight-deal-image"></div>` : ''}
        ${offer.sale.iconName !== '' ? `<span class="sale-badge" aria-hidden="true">${offer.sale.iconName}</span>` : ''}
        <p class="flight-title"><strong>${offer.route.to.name}</strong></p>
        <p class="flight-type">${offer.travelClass.toLowerCase()} ${offer.tripType.toLowerCase().replace(/_/g, ' ')} from</p>
        <p class="price"><span class="price-currency" aria-hidden="true">${offer.price.symbol}</span> ${offer.price.amountFormatted}</p>
      </a>
    </div>
  `;
  console.log(params);
  return li;
}

function updateDeals(deals, block, params, link) {
  const ul = block.querySelector('ul') || document.createElement('ul');
  ul.innerHTML = ''; // Clear existing deals
  
  const fragment = document.createDocumentFragment();
  deals.offers.forEach(offer => {
    fragment.appendChild(createDealElement(offer, params, link));
  });
  
  ul.appendChild(fragment);
  if (!block.contains(ul)) block.appendChild(ul);
}

async function fetchAndUpdateDeals(apiParams, block, params, link) {
  try {
    const response = await fetch(dealsAPI + apiParams);
    const deals = await response.json();
    updateDeals(deals, block, params, link);
  } catch (error) {
    console.error('Error fetching deals:', error);
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
  titleElement.className = 'deals-title-container';
  titleElement.innerHTML = `
    <p class="deals-title">${params.title}</p>
    <select id="citySelector" aria-label="Select departure city">
      ${auPorts.flightDeals.model.departures.map(port => `
        <option value="${port.cityCode}" ${port.cityCode === params.fromPort ? 'selected' : ''}>
          ${port.cityName}
        </option>
      `).join('')}
    </select>
  `;

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