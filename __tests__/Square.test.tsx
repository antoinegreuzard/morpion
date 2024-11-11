import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import Square from "@/components/Square";

describe("Square Component", () => {
  it("doit afficher la valeur 'X'", () => {
    render(<Square value="X" onClick={() => {
    }}/>);
    const squareButton = screen.getByRole("button");
    expect(squareButton).toHaveTextContent("X");
  });

  it("doit afficher la valeur 'O'", () => {
    render(<Square value="O" onClick={() => {
    }}/>);
    const squareButton = screen.getByRole("button");
    expect(squareButton).toHaveTextContent("O");
  });

  it("doit être vide lorsque la valeur est null", () => {
    render(<Square value={null} onClick={() => {
    }}/>);
    const squareButton = screen.getByRole("button");
    expect(squareButton).toBeEmptyDOMElement();
    expect(squareButton).not.toHaveClass("text-blue-500");
    expect(squareButton).not.toHaveClass("text-red-500");
  });

  it("doit appeler la fonction onClick lorsqu'il est cliqué", () => {
    const handleClick = jest.fn();
    render(<Square value={null} onClick={handleClick}/>);
    const squareButton = screen.getByRole("button");

    fireEvent.click(squareButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
