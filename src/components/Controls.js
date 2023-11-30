import "./Controls.css";
import clsx from "clsx";

const Controls = (props) => {

  const shuffleClasses = clsx(
    "button shuffle animate__animated",
    { ["animate__bounceIn"]: props.step === 1 },
    { ["animate__bounceOut"]: props.step !== 1 },
  );

  const currentWinClasses = clsx(
    "animate__animated",
    { ["animate__flash"]: props.afterWinChanged === true },
  );

  return (
    <div className="game-controls">
      <div className="controls-top">
        <div className="controls-left">
          <p>
            Credits: <span>{parseFloat(props.credits).toFixed(2)}</span>
          </p>
          <p>
            Bet Size: <span>{parseFloat(props.betSize).toFixed(2)}</span>
          </p>
        </div>
        <div className="controls-center">  
          <a className={shuffleClasses} onClick={props.onShuffle} href="#">
            &nbsp;
          </a>
        </div>
        <div className="controls-right">
          <a className="button minus" onClick={props.onBetSizeDown} href="#">
            &nbsp;
          </a>
          <a className="button plus" onClick={props.onBetSizeUp} href="#">
            &nbsp;
          </a>
        </div>
      </div>
      <div className="controls-bottom">
        <p>
          WIN: <span className={currentWinClasses}>{parseFloat(props.currentWin).toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default Controls;
