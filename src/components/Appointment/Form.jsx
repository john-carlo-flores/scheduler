import React, { useState } from "react";
import Button from "../Button";
import InterviewerList from "../InterviewerList";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError ] = useState("");

  // Clear student and interviewer state
  const reset = () => {
    setStudent("");
    setInterviewer(null);
  };

  // On cancel click, reset state and call onCancel
  const cancel = () => {
    reset();
    props.onCancel();
  };

  // Validate that student and interviewer cannot be blank
  // If valid, clear error state and call onSave
  const validate = () => {
    if (student === "") {
      return setError("Student name cannot be blank");
    }

    if (interviewer === null) {
      return setError("Please select an interviewer");
    }

    setError("");
    props.onSave(student, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList 
          interviewers={props.interviewers}
          value={interviewer && interviewer.id}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  );
};