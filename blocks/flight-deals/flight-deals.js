import { addBlockClasses, removeUtilityElements, getTrimmedContent } from '../../utils/blockUtils.js';
import { createOptimizedPicture, decorateButtons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {

  const childElements = [
    { key: 'title', className: 'deals-title' },
    { key: 'showDealImages', className: 'deals-show-deal-images' },
    { key: 'fromPort', className: 'deals-from-port' },
    { key: 'travelClass', className: 'deals-travel-class' },
    { key: 'saleName', className: 'deals-sale-name' },
    { key: 'showDisclaimers', className: 'deals-show-disclaimers' }
  ];

  addBlockClasses(block, childElements);
  removeUtilityElements(childElements, ['fromPort', 'travelClass', 'showDealImages', 'showDisclaimers', 'saleName']);

  const { fromPort, showDisclaimers, saleName } = Object.fromEntries(
    ['fromPort', 'showDisclaimers', 'saleName'].map(key => [key, getTrimmedContent(childElements, key)])
  );

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