import { FlightDeals } from 'blocks/flight-deals/flight-deals.js';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the imported modules
vi.mock('./utils/blockUtils.js');
vi.mock('./utils/dealUtils.js');

describe('FlightDeals', () => {
  let flightDeals;
  let mockBlock;
  let mockChildElements;

  beforeEach(() => {
    // Create a more comprehensive mock data object
    const mockData = {
      title: 'Best Flight Deals',
      showDealImages: true,
      fromPort: 'LAX',
      toPorts: ['NYC', 'LON', 'TYO'],
      travelClass: 'Economy',
      saleName: 'Summer Sale',
      showDisclaimers: true,
      // Add any other properties that the component expects
    };

    mockBlock = { 
      appendChild: vi.fn(),
      querySelectorAll: () => [{
        textContent: 'Mock content',
        remove: vi.fn()
      }],
      getData: vi.fn((key) => mockData[key]),
      setData: vi.fn(),
      data: { ...mockData },
    };

    mockChildElements = Object.keys(mockData).map(key => ({
      key,
      className: `deals-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    }));

    flightDeals = new FlightDeals(mockBlock, mockChildElements);
  });

  it('should create an instance of FlightDeals', () => {
    expect(flightDeals).toBeInstanceOf(FlightDeals);
  });

  // Add more tests for individual methods
  it('should correctly set up child elements', () => {
    expect(mockBlock.appendChild).toHaveBeenCalledTimes(mockChildElements.length);
  });

  // Add more specific tests based on the component's functionality
});
