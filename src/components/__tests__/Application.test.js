import React from "react";
import axios from "axios";
import { render, cleanup, waitForElement, fireEvent } from "@testing-library/react";
import { getByText, getByAltText, getByPlaceholderText, getAllByTestId, queryByText } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    const student = "Lydia Miller-Jones";

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: student }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, student));
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();
    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    const student = "Archie Cohen";
    
    await waitForElement(() => getByText(container, student));

    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, student)
    );
  
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, /are you sure you would like to delete./i)).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    const student = "Archie Cohen";
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, student)
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue(student);

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment and goes back to Form on close", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);
    const student = "Archie Cohen";
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, student)
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue(student);
    

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(container, "Error"));
    expect(getByText(appointment, /could not save appointment/i)).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(appointment, "Cancel")).toBeInTheDocument();
    expect(getByText(appointment, "Save")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment and goes back to Confirm on close", async() => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);
    const student = "Archie Cohen";
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, student)
    );

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, /are you sure you would like to delete./i)).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    
    await waitForElement(() => getByText(container, "Error"));
    expect(getByText(appointment, /could not cancel appointment/i)).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(appointment, /are you sure you would like to delete./i)).toBeInTheDocument();
  });
});
