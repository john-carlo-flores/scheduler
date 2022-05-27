import React, { useEffect } from "react";
import { useVisualMode } from "../../hooks/useVisualMode";

import { 
  SHOW, 
  EMPTY, 
  CREATE, 
  SAVING, 
  DELETING, 
  CONFIRM, 
  EDIT, 
  ERROR_SAVE, 
  ERROR_DELETE 
} from "../../constants/constantModes";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import "./styles.scss";

export default function Appointment(props) {
  // Visual mode logic coming from custom hook
  // if interview prop exists default mode is SHOW, else EMPTY
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  // Create/Edit interview object and transition to status 'SAVING'
  // Call bookInterview and transition based on response
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer: interviewer.id
    }

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((err) => transition(ERROR_SAVE, true));
  };

  // Transition to Status 'DELETING', call cancelInterview and transition based on response
  const destroy = () => {
    transition(DELETING, true);

    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, true));
  };

  // Change transition when interview changes based on server-side data update
  useEffect(() => {
    if (mode === EMPTY && props.interview) {
      return transition(SHOW);
    }

    if (mode === SHOW && !props.interview) {
      return transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  return (
    <article className="appointment" data-testid="appointment">
      <Header />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={back}
          onConfirm={destroy}
        />
      )}
      {mode === EDIT && 
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      }
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment"
          onClose={back} 
        />
      )}      
      {mode === ERROR_DELETE && (
        <Error
          message="Could not cancel appointment"
          onClose={back} 
        />
      )}
    </article>
  );
};