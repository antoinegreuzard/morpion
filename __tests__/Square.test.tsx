import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import Square from "@/components/Square";

describe("Square Component", () => {
  const onClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Square with no value", () => {
    render(<Square value={null} onClick={onClickMock}/>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("");
    expect(button).toHaveClass("bg-white border-gray-300 hover:bg-gray-100");
  });

  it("should render the Square with an 'X' value", () => {
    render(<Square value="X" onClick={onClickMock}/>);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("X");
    expect(button).toHaveClass("text-[var(--color-player)] bg-blue-100 border-blue-300 animate-pop");
  });

  it("should render the Square with an 'O' value", () => {
    render(<Square value="O" onClick={onClickMock}/>);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("O");
    expect(button).toHaveClass("text-[var(--color-ai)] bg-red-100 border-red-300 animate-pop");
  });

  it("should call onClick when the Square is clicked", () => {
    render(<Square value={null} onClick={onClickMock}/>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should apply hover and transition effects when hovered and clicked", () => {
    render(<Square value={null} onClick={onClickMock}/>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:scale-105 transition-transform duration-300 ease-in-out transform");
  });
});
