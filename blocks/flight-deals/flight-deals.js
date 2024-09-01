import { BlockUtils } from '../../utils/blockUtils.js';

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

  const fields = ['fromPort', 'showDisclaimers', 'saleName', 'toPorts', 'travelClass'];
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
  
  try {
    const response = await fetch(dealsAPI + dealsAPIParams);
    const deals = await response.json();

    const ul = document.createElement('ul');
    const fragment = document.createDocumentFragment();

    deals.offers.forEach(offer => {
      const li = document.createElement('li');
      li.className = 'deal-item';
      li.innerHTML = `
        <div class="deal-item-content">
          ${offer.sale && typeof offer.sale === 'object' ? `<p>${offer.sale.iconName}</p>` : ''}
          <p><strong>${offer.route.to.name}</strong></p>
          <p class="deal-item-type">${offer.travelClass} ${offer.tripType} from</p>
          <p>${offer.price.symbol} ${offer.price.amountFormatted}</p>
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