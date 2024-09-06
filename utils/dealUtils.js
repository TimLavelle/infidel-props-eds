const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers';
const flightImage = 'https://tims-personal-stuff.s3.ap-southeast-2.amazonaws.com/poolside-beach-chairs-jamaica.jpg';

export async function fetchAuPorts() {
  const response = await fetch('../../utils/resources/auPorts.json');
  return response.json();
}

export function createDealElement(offer, params, link) {
  const {
    deepLink, route, travelClass, tripType, price, sale,
  } = offer;
  const { showDealImages } = params;
  const { to } = route;
  const { symbol, amountFormatted } = price;

  const li = document.createElement('li');
  li.className = 'deal-item';

  const formattedTripType = tripType.toLowerCase().replace(/_/g, ' ');
  const formattedTravelClass = travelClass.toLowerCase();

  li.innerHTML = `
    <div class="flight-deal-card">
      <a href="${link || deepLink}" aria-label="Flight deal to ${to.name}: ${formattedTravelClass} ${formattedTripType} from ${symbol}${amountFormatted}" tabindex="0">
        ${showDealImages === 'true' && flightImage ? `<div class="flight-deal-image-container"><img src="${flightImage}" alt="" role="presentation" class="flight-deal-image"></div>` : ''}
        ${sale.iconName ? `<span class="sale-badge" aria-hidden="true">${sale.iconName}</span>` : ''}
        <p class="flight-title"><strong>${to.name}</strong></p>
        <p class="flight-type">${formattedTravelClass} ${formattedTripType} from</p>
        <p class="price"><span class="price-currency" aria-hidden="true">${symbol}</span> ${amountFormatted}</p>
      </a>
    </div>
  `;

  return li;
}

export function updateDeals(deals, block, params, link) {
  const ul = block.querySelector('.deals-container ul') || document.createElement('ul');
  ul.innerHTML = '';

  const fragment = document.createDocumentFragment();
  deals.offers.forEach((offer) => fragment.appendChild(createDealElement(offer, params, link)));

  if (!block.querySelector('.deals-container')) {
    const dealsContainer = document.createElement('div');
    dealsContainer.className = 'deals-container';
    dealsContainer.appendChild(ul);
    block.appendChild(dealsContainer);
  } else {
    block.querySelector('.deals-container').appendChild(ul);
  }
  ul.appendChild(fragment);
  if (!block.contains(ul)) block.appendChild(ul);
}

export async function fetchAndUpdateDeals(apiParams, block, params, link) {
  try {
    block.querySelectorAll('.error-container').forEach((container) => container.remove());

    const response = await fetch(dealsAPI + apiParams);
    const deals = await response.json();

    if (deals.offers && deals.offers.length > 0) {
      updateDeals(deals, block, params, link);
    } else {
      const auPorts = await fetchAuPorts();
      const noOffersMessage = auPorts.flightDeals.ui.defaultMsgNoOffers;

      const errorContainer = document.createElement('div');
      errorContainer.className = 'error-container';
      errorContainer.innerHTML = `<p>${noOffersMessage}</p>`;

      block.querySelector('.deals-container')?.remove();
      block.appendChild(errorContainer);
    }
  } catch (error) {
    console.error('Error fetching deals:', error);
  }
}
