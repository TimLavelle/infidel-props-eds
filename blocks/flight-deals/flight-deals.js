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
  const { fromPort, showDisclaimers, saleName, toPorts, travelClass } = Object.fromEntries(
    fields.map(key => [key, blockUtils.getTrimmedContent(key) || ''])
  );

  // Split toPorts string into an array and process each destination
  const destinationParams = toPorts.split(',')
    .map(toPort => toPort.trim())
    .filter(toPort => toPort !== '')
    .map(toPort => `&destination=${toPort}:${travelClass}`)
    .join('');

  const saleNameParams = saleName.split(',')
    .map(sale => sale.trim())
    .filter(sale => sale !== '')
    .map(sale => `&saleName=${sale}`)
    .join('');

  // Construct the API URL with the processed destination parameters
  const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers';
  const dealsAPIParams = `?departureAirport=${fromPort}&includeDisclaimers=${showDisclaimers}${saleNameParams}${destinationParams}`;
  const deals = await fetch(dealsAPI + dealsAPIParams).then(res => res.json());

  const ul = document.createElement('ul');
  let dealsItems = '';

  deals.offers.forEach(offer => {
    dealsItems += `
      <li class="deal-item">
        <div class="deal-item-content">
          ${offer.sale && typeof offer.sale === 'object' ? `<p>${offer.sale.iconName}</p>` : ''}
          <p><strong>${offer.route.to.name}</strong></p>
          <p class="deal-item-type">${offer.travelClass + ' ' + offer.tripType} from</p>
          <p>${offer.price.symbol} ${offer.price.amountFormatted}</p>
        </div>
      </li>
    `;
  });

  ul.innerHTML = dealsItems;
  block.append(ul);

}