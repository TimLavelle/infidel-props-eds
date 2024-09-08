import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  fetchAuPorts,
  createDealElement,
  updateDeals,
  fetchAndUpdateDeals,
} from "./dealUtils.js";

// Mock fetch globally
global.fetch = vi.fn();

describe("Deal Utilities Functions", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("Retrieve Airports from API", () => {
    it("It should fetch and return Airports data for API usage", async () => {
      const mockData = { ports: ["SYD", "MEL"] };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchAuPorts();
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        "../utils/resources/auPorts.json",
      );
    });
  });

  describe("createDealElement", () => {
    it("should create a deal element with correct structure", () => {
      const offer = {
        deepLink: "https://example.com",
        route: { to: { name: "Sydney" } },
        travelClass: "ECONOMY",
        tripType: "RETURN",
        price: { symbol: "$", amountFormatted: "500" },
        sale: {},
      };
      const params = { showDealImages: "false" };

      const element = createDealElement(offer, params);
      expect(element.tagName).toBe("LI");
      expect(element.className).toBe("deal-item");
      expect(element.querySelector("a")).not.toBeNull();
      expect(element.querySelector(".flight-title")).not.toBeNull();
      expect(element.querySelector(".price")).not.toBeNull();
    });
  });

  describe("updateDeals", () => {
    it("should update the deals container with new deals", () => {
      const deals = {
        offers: [
          {
            deepLink: "https://example.com",
            route: { to: { name: "Sydney" } },
            travelClass: "ECONOMY",
            tripType: "RETURN",
            price: { symbol: "$", amountFormatted: "500" },
            sale: {},
          },
        ],
      };
      const block = document.createElement("div");
      const params = { showDealImages: "false" };

      updateDeals(deals, block, params);

      expect(block.querySelector(".deals-container")).not.toBeNull();
      expect(block.querySelectorAll(".deal-item").length).toBe(1);
    });
  });

  describe("fetchAndUpdateDeals", () => {
    it("should fetch deals and update the container", async () => {
      const mockDeals = {
        offers: [
          {
            deepLink: "https://example.com",
            route: { to: { name: "Sydney" } },
            travelClass: "ECONOMY",
            tripType: "RETURN",
            price: { symbol: "$", amountFormatted: "500" },
            sale: {},
          },
        ],
      };
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockDeals),
      });

      const block = document.createElement("div");
      const params = { showDealImages: "false" };
      const apiParams = "?param1=value1";

      await fetchAndUpdateDeals(apiParams, block, params);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(apiParams),
      );
      expect(block.querySelector(".deals-container")).not.toBeNull();
      expect(block.querySelectorAll(".deal-item").length).toBe(1);
    });

    it("should display error message when no offers are available", async () => {
      const mockDeals = { offers: [] };
      const mockAuPorts = {
        flightDeals: {
          ui: {
            defaultMsgNoOffers: "No offers available",
          },
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockDeals),
      });
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockAuPorts),
      });

      const block = document.createElement("div");
      const params = { showDealImages: "false" };
      const apiParams = "?param1=value1";

      await fetchAndUpdateDeals(apiParams, block, params);

      expect(block.querySelector(".error-container")).not.toBeNull();
      expect(block.querySelector(".error-container").textContent).toBe(
        "No offers available",
      );
    });
  });
});
