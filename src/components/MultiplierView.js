import "./MultiplierView.css";

const MultiplierView = (props) => {

    return (
        <div className="multiplier-wrapper">
            <div className="animate__animated animate__rubberBand multiplier-view">
            X{props.multiplier}
            </div>
        </div>
    );
};

export default MultiplierView;