import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  fetch('https://www.qantas.com/api/flightOffers/v2/offers?departureAirport=SYD&includeDisclaimers=false&saleName=London%20and%20Paris%20Red%20Tail%20Sale&destination=CDG:ECONOMY&destination=LHR:ECONOMY')
    .then(response => response.json())
    .then(data => {
      data.offers.forEach(offer => {
        const li = document.createElement('li');
        moveInstrumentation(block, li);
        
        const p1 = document.createElement('p');
        p1.textContent = `Destination: ${offer.route.to.name}`;
        li.appendChild(p1);

        const p2 = document.createElement('p');
        p2.textContent = `Travel Class: ${offer.travelClass}`;
        li.appendChild(p2);

        const p3 = document.createElement('p');
        p3.textContent = `Trip Type: ${offer.tripType}`;
        li.appendChild(p3);

        const p4 = document.createElement('p');
        p4.textContent = `Fare Family: ${offer.fareFamily}`;
        li.appendChild(p4);
        
        ul.appendChild(li);
        console.log(offer);
      });
    })
    .catch(error => {
      console.error('Error fetching flight deals:', error);
    });
}