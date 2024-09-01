import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {

  const dealsAPI = 'https://www.qantas.com/api/flightOffers/v2/offers?departureAirport=SYD&includeDisclaimers=false&saleName=London%20and%20Paris%20Red%20Tail%20Sale&destination=CDG:ECONOMY&destination=LHR:ECONOMY';  const ul = document.createElement('ul');
  const deals = await fetch(dealsAPI).then(res => res.json());

  let dealsItems = '';

  deals.offers.forEach(offer => {
    dealsItems += `<li>${offer.route.to.name}</li>`;
  });

  ul.innerHTML = dealsItems;
  block.append(ul);
}