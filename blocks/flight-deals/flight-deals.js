import { addBlockClasses, removeUtilityElements } from '../../utils/blockUtils.js';

export default async function decorate(block) {

  const childElements = [
    { key: 'title', className: 'deals-title' },
    { key: 'fromPort', className: 'deals-from-port' },
    { key: 'travelClass', className: 'deals-travel-class' },
    { key: 'showDealImages', className: 'deals-show-deal-images' }
  ];

  addBlockClasses(block, childElements);
  removeUtilityElements(childElements, ['fromPort', 'travelClass', 'showDealImages']);

  const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers?departureAirport=SYD&includeDisclaimers=false&saleName=London%20and%20Paris%20Red%20Tail%20Sale&destination=CDG:ECONOMY&destination=LHR:ECONOMY';  const ul = document.createElement('ul');
  const deals = await fetch(dealsAPI).then(res => res.json());

  let dealsItems = '';

  deals.offers.forEach(offer => {
    dealsItems += `
      <li>
        <div class="deal-item">
          <div class="deal-item-image">
            image placeholder
          </div>
          <div class="deal-item-content">
            ${offer.sale && typeof offer.sale === 'object' && offer.sale.name ? `<p>${offer.sale.name}</p>` : ''}
            <p><strong>${offer.route.from.name}</strong></p>
            <p class="deal-item-type">${offer.travelClass + offer.tripType} from</p>
            <p>${offer.price.symbol} ${offer.price.amountFormatted}</p>
          </div>
        </div>
      </li>
    `;
  });

  ul.innerHTML = dealsItems;
  block.append(ul);
}