import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const dayListItems = props.days.map(day => 
    <DayListItem 
      key={day.id}
      name={day.name}
      spots={day.spots}
      setDay={() => props.setDay(props.name)}
    />);

  return (
    <ul>
      {dayListItems}
    </ul>
  );
};