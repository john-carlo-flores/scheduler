import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss"

const formatSpots = (spots) => {
  if (spots === 1) return '1 spot';
  if (spots > 0) return `${spots} spots`;
  return 'no spots';
};

export default function DayListItem(props) {
  const listClasses = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  });

  return (
    <li className={listClasses} onClick={props.setDay}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)} remaining</h3>
    </li>
  );
};