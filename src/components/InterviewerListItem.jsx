import React from "react";
import classNames from "classnames";
import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  const { id, avatar, name, setInterviewer, selected } = props;
  const listClasses = classNames("interviewers__item", {
    'interviewers__item--selected': selected
  });

  return (
    <li onClick={() => setInterviewer(id)} className={listClasses}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {selected ? name : ''}
    </li>
  );
};