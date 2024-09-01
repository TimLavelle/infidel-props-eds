import { addBlockClasses, removeUtilityElements, getTrimmedContent } from '../../utils/blockUtils.js';
import { createOptimizedPicture, decorateButtons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {

  const childElements = [
    { key: 'title', className: 'deals-title' },
    { key: 'fromPort', className: 'deals-from-port' },
    { key: 'travelClass', className: 'deals-travel-class' },
    { key: 'showDealImages', className: 'deals-show-deal-images' },
    { key: 'showDisclaimers', className: 'deals-show-disclaimers' }
  ];

  addBlockClasses(block, childElements);
  removeUtilityElements(childElements, ['fromPort', 'travelClass', 'showDealImages', 'showDisclaimers']);

  const fromPort = getTrimmedContent(childElements, 'fromPort');
  const showDisclaimers = getTrimmedContent(childElements, 'showDisclaimers');

  const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers?departureAirport=' + fromPort + '&includeDisclaimers=' + showDisclaimers + '&saleName=London%20and%20Paris%20Red%20Tail%20Sale&destination=CDG:ECONOMY&destination=LHR:ECONOMY';  
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