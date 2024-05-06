import React from "react";
import { render, screen } from "@testing-library/react";
import Cart from "./Cart";
import { useLocation } from "react-router-dom";
import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebase-config";

// Mock useLocation hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("Cart Component", () => {
  const mockLocation = {
    search: "?userId=user123", // Mock search params with user ID
  };

  // Mock cart items data
  const mockCartItems = [
    {
      id: "1",
      dishName: "Pizza",
      price: "$10",
      quantity: 2,
      restaurantId: "res123",
      userId: "user123",
    },
    {
      id: "2",
      dishName: "Burger",
      price: "$8",
      quantity: 1,
      restaurantId: "res456",
      userId: "user123",
    },
  ];

  // Mock useLocation hook to return mock location
  useLocation.mockReturnValue(mockLocation);

  test("renders without crashing", () => {
    render(<Cart />);
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  test("fetches cart items data successfully", async () => {
    // Mock Firestore query function to return cart items data
    const mockQueryFn = jest.fn().mockResolvedValueOnce({
      docs: mockCartItems.map((item) => ({
        id: item.id,
        data: () => item,
      })),
    });
    db.collection = jest.fn(() => ({
      where: jest.fn(() => ({ get: mockQueryFn })),
    }));

    render(<Cart />);

    // Wait for cart items data to be loaded
    for (const item of mockCartItems) {
      expect(await screen.findByText(item.dishName)).toBeInTheDocument();
      expect(screen.getByText(`Price: ${item.price}`)).toBeInTheDocument();
      expect(
        screen.getByText(`Quantity: ${item.quantity}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Restaurant ID: ${item.restaurantId}`)
      ).toBeInTheDocument();
      expect(screen.getByText(`User ID: ${item.userId}`)).toBeInTheDocument();
    }
  });

  test("handles error when fetching cart items data", async () => {
    // Mock Firestore query function to throw an error
    const mockQueryFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Firestore Error"));
    db.collection = jest.fn(() => ({
      where: jest.fn(() => ({ get: mockQueryFn })),
    }));

    render(<Cart />);

    // Wait for error message to be displayed
    expect(
      await screen.findByText("Error fetching cart items")
    ).toBeInTheDocument();
  });
});
