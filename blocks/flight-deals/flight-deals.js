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

  const { fromPort, showDisclaimers, saleName } = Object.fromEntries(
    ['fromPort', 'showDisclaimers', 'saleName'].map(key => [key, blockUtils.getTrimmedContent(key)])
  );
  console.log(toPorts);

  

  const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers?departureAirport=' + fromPort + '&includeDisclaimers=' + showDisclaimers + '&saleName=' + saleName + '&destination=CDG:ECONOMY&destination=LHR:ECONOMY';  
  const deals = await fetch(dealsAPI).then(res => res.json());

  const ul = document.createElement('ul');
  let dealsItems = '';

  deals.offers.forEach(offer => {
    dealsItems += `
      <li class="deal-item">
        <div class="deal-item-content">
          ${offer.sale && typeof offer.sale === 'object' && offer.sale.name ? `<p>${offer.sale.name}</p>` : ''}
          <p><strong>${offer.route.from.name}</strong></p>
          <p class="deal-item-type">${offer.travelClass + ' ' + offer.tripType} from</p>
          <p>${offer.price.symbol} ${offer.price.amountFormatted}</p>
        </div>
      </li>
    `;
  });

  ul.innerHTML = dealsItems;
  block.append(ul);

}