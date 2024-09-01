import { BlockUtils } from '../../utils/blockUtils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const flightImage = 'https://tims-personal-stuff.s3.ap-southeast-2.amazonaws.com/poolside-beach-chairs-jamaica.jpg';
const link = 'https://www.qantas.com/au/en/flight-deals/flights-from-sydney-to-ballina-byron.html/syd/bnk/economy?int_cam=au:en:flight-deals-home-page:flight-deals-hp:en:nn';
const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers';

async function fetchAuPorts() {
  const response = await fetch('../../utils/resources/auPorts.json');
  return response.json();
}

async function getCityName(cityCode) {
  const auPorts = await fetchAuPorts();
  const departure = auPorts.flightDeals.model.departures.find(dep => dep.cityCode === cityCode);
  return departure ? departure.cityName : cityCode;
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

  // Creating the loop of the destination params
  const destinationParams = params.toPorts?.split(',')
    .map(toPort => `&destination=${toPort.trim()}:${params.travelClass}`)
    .join('') || '';

  // creating the sale name params
  const saleNameParams = params.saleName?.split(',')
    .map(sale => `&saleName=${sale.trim()}`)
    .join('') || '';

  // creating the deals API params
  const dealsAPIParams = `?departureAirport=${params.fromPort}&includeDisclaimers=${params.showDisclaimers}${saleNameParams}${destinationParams}`;

  const cityName = await getCityName(params.fromPort);
  const titleElement = document.createElement('div');
  titleElement.className = 'deals-title-container';
  titleElement.innerHTML = `
    <p class="deals-title">${params.title}</p>
    <select id="citySelector" aria-label="Select departure city">
      ${(await fetchAuPorts()).flightDeals.model.departures.map(port => `
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
    const newDealsAPIParams = `?departureAirport=${selectedCityCode}&includeDisclaimers=${params.showDisclaimers}${saleNameParams}${destinationParams}`;
    
    try {
      const response = await fetch(dealsAPI + newDealsAPIParams);
      const newDeals = await response.json();
      updateDeals(newDeals, block, params);
    } catch (error) {
      console.error('Error fetching new deals:', error);
    }
  });
  block.insertBefore(titleElement, block.firstChild);
  
  try {
    const response = await fetch(dealsAPI + dealsAPIParams);
    const deals = await response.json();

    const ul = document.createElement('ul');
    const fragment = document.createDocumentFragment();

    deals.offers.forEach(offer => {
      const li = document.createElement('li');
      li.className = 'deal-item';
      li.innerHTML = `
        <div class="flight-deal-card">
          <a href="${link}" aria-label="Flight deal to ${offer.route.to.name}: ${offer.travelClass.toLowerCase()} ${offer.tripType.toLowerCase().replace(/_/g, ' ')} from ${offer.price.symbol}${offer.price.amountFormatted}" tabindex="0">
            ${params.showDealImages === 'true' && flightImage ? `<div class="flight-deal-image-container"><img src="${flightImage}" alt="" role="presentation" class="flight-deal-image"></div>` : ''}
            ${offer.sale.iconName !== '' ? `<span class="sale-badge" aria-hidden="true">${offer.sale.iconName}</span>` : ''}
            <p class="flight-title"><strong>${offer.route.to.name}</strong></p>
            <p class="flight-type">${offer.travelClass.toLowerCase()} ${offer.tripType.toLowerCase().replace(/_/g, ' ')} from</p>
            <p class="price"><span class="price-currency" aria-hidden="true">${offer.price.symbol}</span> ${offer.price.amountFormatted}</p>
          </a>
        </div>
      `;
      fragment.appendChild(li);
    });

    ul.appendChild(fragment);
    block.appendChild(ul);
  } catch (error) {
    console.error('Error fetching deals:', error);
  }
}