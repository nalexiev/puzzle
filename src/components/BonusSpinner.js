import { useState, useEffect } from "react";

import "./BonusSpinner.css";

import clsx from "clsx";

const BonusSpinner = (props) => {

    const [state, setState] = useState({
        customSpinnerClass: "",
        customCubeClass: ""
    });

    useEffect(() => {
        if (props.visible) {
            setState((prev) => {
                return {
                    ...prev,
                    customSpinnerClass: props.visible ? 'visible' : '',
                };
            });

            setTimeout(() => {
                setState((prev) => {
                    return {
                        ...prev,
                        customCubeClass: props.bonusSpinnerBonus !== 0 ? 'show-win' : 'show-loose',
                    };
                });

                setTimeout(() => {
                    (props.afterRotation)();
                }, 2500);
            }, 500);
        }
        else {
            setState((prev) => {
                return {
                    ...prev,
                    customCubeClass: '',
                    customSpinnerClass: '',
                };
            });
        }
    }, [props.visible]);

    const spinnerClasses = clsx(
        "spinner",
        state.customSpinnerClass
    );

    const cubeClasses = clsx(
        "cube",
        state.customCubeClass
    );

    const faceClasses = [
        "cube__face cube__face--front",
        "cube__face cube__face--back",
        "cube__face cube__face--right",
        "cube__face cube__face--left",
        "cube__face cube__face--top",
        "cube__face cube__face--bottom"
    ];

    return <div className={spinnerClasses}>
        <div className={cubeClasses}>
            {faceClasses.map((item, index) => {
                return <div key={index} className={item}>
                    BONUS
                </div>
            })}
        </div>
    </div>;
};

export default BonusSpinner;