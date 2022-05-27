import React from "react";
import classNames from "classnames";
import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  const { avatar, name, setInterviewer, selected } = props;

  // Append selected CSS class if interviewer is selected
  const listClasses = classNames("interviewers__item", {
    'interviewers__item--selected': selected
  });

  return (
    <li onClick={setInterviewer} className={listClasses}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>
  );
};