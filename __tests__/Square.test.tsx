import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import Square from "@/components/Square";

describe("Square Component", () => {
  it("doit afficher la valeur 'X' avec la classe correspondante", () => {
    render(<Square value="X" onClick={() => {
    }}/>);
    const squareButton = screen.getByRole("button");
    expect(squareButton).toHaveTextContent("X");
    expect(squareButton).toHaveClass("text-blue-500");
    expect(squareButton).toHaveClass("animate-pop");
  });

  it("doit afficher la valeur 'O' avec la classe correspondante", () => {
    render(<Square value="O" onClick={() => {
    }}/>);
    const squareButton = screen.getByRole("button");
    expect(squareButton).toHaveTextContent("O");
    expect(squareButton).toHaveClass("text-red-500");
    expect(squareButton).toHaveClass("animate-pop");
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

  it("doit avoir la classe 'hover:scale-105' pour l'animation au survol", () => {
    render(<Square value={null} onClick={() => {
    }}/>);
    const squareButton = screen.getByRole("button");
    expect(squareButton).toHaveClass("hover:scale-105");
  });
});
