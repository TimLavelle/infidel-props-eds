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
        
        Object.entries(offer).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            const p = document.createElement('p');
            p.textContent = `${key}: ${value}`;
            li.appendChild(p);
          }
        });
        
        ul.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error fetching flight deals:', error);
    });
}