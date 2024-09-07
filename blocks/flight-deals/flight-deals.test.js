import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

import decorate from './flight-deals.js';
import BlockUtils from '../../utils/blockUtils.js';
import { fetchAuPorts, fetchAndUpdateDeals } from '../../utils/dealUtils.js';

vi.mock('../../utils/blockUtils.js');
vi.mock('../../utils/dealUtils.js');

describe('Flight Deals Block', () => {
  const utilityElements = [
    'showDealImages', 'showDisclaimers', 'saleName',
    'fromPort', 'travelClass', 'toPorts',
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    fetchAuPorts.mockResolvedValue({
      flightDeals: {
        model: {
          departures: [
            { cityCode: 'SYD', cityName: 'Sydney' },
            { cityCode: 'MEL', cityName: 'Melbourne' },
          ],
        },
      },
    });

    fetchAndUpdateDeals.mockResolvedValue();
  });

  describe('Utility elements working as expected', () => {
    function createMockBlock() {
      const mockBlock = document.createElement('div');
      utilityElements.forEach((el) => {
        const elem = document.createElement('div');
        elem.className = el;
        mockBlock.appendChild(elem);
      });
      return mockBlock;
    }

    it.concurrent('should create utility divs and assign classes correctly for removal later in the script', () => {
      const mockBlock = createMockBlock();
      expect(mockBlock.children.length).toBe(utilityElements.length);
    });

    it.concurrent('should remove all utility elements from the DOM', async () => {
      const mockBlock = createMockBlock();
      const initialChildCount = mockBlock.children.length;

      const mockRemoveUtilityElements = vi.fn((elements) => {
        elements.forEach((el) => mockBlock.querySelector(`.${el}`)?.remove());
      });

      BlockUtils.mockImplementation(() => ({
        removeUtilityElements: mockRemoveUtilityElements,
        getTrimmedContent: vi.fn(),
      }));

      await decorate(mockBlock);

      expect(mockRemoveUtilityElements).toHaveBeenCalledWith(utilityElements);
      expect(mockBlock.children.length).toBeLessThan(initialChildCount);
    });
  });
});
