import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dishes from "./Dishes";
import { useParams } from "react-router-dom";
import { db } from "../../Config/firebase-config";

// Mock useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("Dishes Component", () => {
  // Mock dishes data
  const mockDishes = [
    {
      id: "1",
      dish_name: "Pizza",
      price: "$10",
      ratings: "5",
      reviews: "Delicious!",
    },
    {
      id: "2",
      dish_name: "Burger",
      price: "$8",
      ratings: "4",
      reviews: "Tasty!",
    },
  ];

  // Mock useParams value
  useParams.mockReturnValue({ restaurantId: "restaurant1" });

  test("renders without crashing", () => {
    render(<Dishes />);
    expect(screen.getByText("Dishes")).toBeInTheDocument();
  });

  test("fetches dishes data successfully", async () => {
    // Mock the Firestore query function
    const mockQueryFn = jest.fn().mockResolvedValueOnce({
      docs: mockDishes.map((dish) => ({
        id: dish.id,
        data: () => dish,
      })),
    });
    db.collection = jest.fn(() => ({
      where: jest.fn(() => ({ get: mockQueryFn })),
    }));

    render(<Dishes />);

    // Wait for dishes data to be loaded
    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });
  });

  test("handles error when fetching dishes data", async () => {
    // Mock the Firestore query function to throw an error
    const mockQueryFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Firestore Error"));
    db.collection = jest.fn(() => ({
      where: jest.fn(() => ({ get: mockQueryFn })),
    }));

    render(<Dishes />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText("Error getting dishes data")).toBeInTheDocument();
    });
  });

  test("updates quantity correctly on user interaction", async () => {
    render(<Dishes />);

    // Simulate increasing quantity
    fireEvent.click(screen.getAllByText("+")[0]);

    // Check if quantity is updated
    await waitFor(() => {
      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    });

    // Simulate decreasing quantity
    fireEvent.click(screen.getAllByText("-")[0]);

    // Check if quantity is updated
    await waitFor(() => {
      expect(screen.getByDisplayValue("0")).toBeInTheDocument();
    });
  });

  test("adds dish to cart successfully for authenticated user", async () => {
    // Mock current user ID
    const userId = "user123";
    jest
      .spyOn(global, "auth", "get")
      .mockReturnValue({ currentUser: { uid: userId } });

    // Mock addToCart function
    const mockAddToCart = jest.fn();
    jest.mock("../../Config/firebase-config", () => ({
      ...jest.requireActual("../../Config/firebase-config"),
      addDoc: mockAddToCart,
    }));

    render(<Dishes />);

    // Simulate adding dish to cart
    fireEvent.click(screen.getByText("Add to Cart"));

    // Check if addToCart function is called with correct parameters
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          dishName: "Pizza",
          price: "$10",
          quantity: 1,
          restaurantId: "restaurant1",
          userId: userId,
        })
      );
    });
  });

  test("displays alert for unauthenticated user when adding to cart", async () => {
    // Mock current user ID as null (not authenticated)
    jest.spyOn(global, "auth", "get").mockReturnValue({ currentUser: null });

    // Mock window alert function
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<Dishes />);

    // Simulate adding dish to cart
    fireEvent.click(screen.getByText("Add to Cart"));

    // Check if alert is displayed
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        "Please login to add items to the cart."
      );
    });
  });
});
