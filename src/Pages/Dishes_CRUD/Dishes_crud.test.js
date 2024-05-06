import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DishesCrud from "./Dishes_crud";

describe("DishesCrud Component", () => {
  test("renders without crashing", () => {
    render(<DishesCrud />);
    expect(screen.getByText("Add Dish")).toBeInTheDocument();
    expect(screen.getByLabelText("Dish Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Price:")).toBeInTheDocument();
    expect(screen.getByLabelText("Ratings:")).toBeInTheDocument();
    expect(screen.getByLabelText("Reviews:")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("validates form fields", async () => {
    render(<DishesCrud />);
    fireEvent.click(screen.getByText("Submit"));
    expect(
      await screen.findByText("Dish name is required")
    ).toBeInTheDocument();
    expect(await screen.findByText("Price is required")).toBeInTheDocument();
    expect(await screen.findByText("Ratings is required")).toBeInTheDocument();
    expect(await screen.findByText("Reviews is required")).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    render(<DishesCrud />);
    userEvent.type(screen.getByLabelText("Dish Name:"), "Pizza");
    userEvent.type(screen.getByLabelText("Price:"), "10");
    userEvent.type(screen.getByLabelText("Ratings:"), "5");
    userEvent.type(screen.getByLabelText("Reviews:"), "Delicious!");
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(screen.getByText("Dish added successfully")).toBeInTheDocument();
    });
  });

  test("handles form submission error", async () => {
    // Mock the addDoc function to throw an error
    jest.spyOn(global, "addDoc").mockImplementation(() => {
      throw new Error("Firebase Error");
    });
    render(<DishesCrud />);
    userEvent.type(screen.getByLabelText("Dish Name:"), "Pizza");
    userEvent.type(screen.getByLabelText("Price:"), "10");
    userEvent.type(screen.getByLabelText("Ratings:"), "5");
    userEvent.type(screen.getByLabelText("Reviews:"), "Delicious!");
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(screen.getByText("Error adding dish")).toBeInTheDocument();
    });
  });
});
