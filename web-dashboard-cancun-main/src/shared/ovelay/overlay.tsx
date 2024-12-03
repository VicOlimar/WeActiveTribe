import React from "react";
import "./overlay.scss";

type Props = {
    children?: React.ReactNode;
    clickEvent?: () => void;
}

const Overlay = (props: Props) => {
  return (
    <div onClick={ props.clickEvent ? props.clickEvent! : () => {}} className="overlay">
      <div className="overlay__child">{props.children}</div>
    </div>
  );
}

export default Overlay;
