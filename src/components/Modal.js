import "./Modal.css";
import clsx from "clsx";

const Modal = (props) => {

  const tileClasses = clsx(
    "modal-overlay",
    { ["visible"]: props.visible },
    { ["has-text"]: props.text },
  );

  return (
    <div className={tileClasses}>
      <div className="modal-modal">
        <div className="inner">
          <h1>{props.title}</h1>
          {props.text && (
            <p>{props.text}</p>
          )}
          {props.button && (
            <div className="content">
              <a onClick={props.button.onClickHandler} href="#">{props.button.text}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
