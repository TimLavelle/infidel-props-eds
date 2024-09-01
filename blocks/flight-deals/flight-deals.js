import { BlockUtils } from '../../utils/blockUtils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

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
  blockUtils.removeUtilityElements(['showDealImages', 'showDisclaimers', 'saleName', 'fromPort', 'travelClass', 'toPorts']);

  const fields = ['fromPort', 'showDisclaimers', 'saleName', 'toPorts', 'travelClass', 'showDealImages'];
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

  const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers';
  const dealsAPIParams = `?departureAirport=${params.fromPort}&includeDisclaimers=${params.showDisclaimers}${saleNameParams}${destinationParams}`;
  const flightImage = 'https://tims-personal-stuff.s3.ap-southeast-2.amazonaws.com/poolside-beach-chairs-jamaica.jpg';
  console.log(params.showDealImages);
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
          ${params.showDealImages === true ? `<img src="${flightImage}" alt="Flight Deal Image" class="flight-deal-image">` : ''}
          ${offer.sale.iconName !== '' ? `<span class="sale-badge">${offer.sale.iconName}</span>` : ''}
          <p class="flight-title"><strong>${offer.route.to.name}</strong></p>
          <p class="flight-type">${offer.travelClass.toLowerCase()} ${offer.tripType.toLowerCase().replace(/_/g, ' ')} from</p>
          <p class="price"><span class="price-currency">${offer.price.symbol}</span> ${offer.price.amountFormatted}</p>
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