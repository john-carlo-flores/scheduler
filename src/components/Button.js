import React from "react";
import classNames from "classnames";
import "components/Button.scss";

export default function Button(props) {
  // Append selected CSS class depending if props is set to confirm or danger
   const buttonClass = classNames('button', { 
      'button--confirm': props.confirm,
      'button--danger': props.danger
   });

   return (
      <button 
         className={buttonClass} 
         onClick={props.onClick}  
         disabled={props.disabled}
      >
         {props.children}
      </button>
   );
}
