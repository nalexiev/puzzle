import { useState, useEffect } from "react";
import BonusTypes from "../helpers/BonusTypes";

import "./BonusSpinner.css";

import clsx from "clsx";

const BonusSpinner = (props) => {

    const [state, setState] = useState({
        visible: false,
        options: [],
        top: 0
    });

    const getBonusById = (id) => {
        let bonus = BonusTypes.NO_BONUS;

        for(let bonusElement in BonusTypes) {
            const bonusType = BonusTypes[bonusElement];
            
            if (bonusType.index === id) {
                bonus = bonusType;
            }
        }

        return bonus;
    };

    const getMappedBonuses = (possibleBonuses) => {
        const bonuses = [];

        for(let bonus in BonusTypes) {
            const bonusType = BonusTypes[bonus];

            for(let possibleBonus in possibleBonuses) {
                if (possibleBonuses[possibleBonus] === bonusType.index) {
                    bonuses.push(bonusType);
                }
            }
        }

        return bonuses;
    };

    const getOptions = (bonus) => {
        const currentBonus = getBonusById(bonus.bonus);
        const possibleBonuses = getMappedBonuses(bonus.possibleBonuses);
        const options = [];

        for(let i = 0; i < 20; i++) {
            if(i % 2 == 0) {
                options.push(BonusTypes.NO_BONUS);
            }
            for(let a = 0; a < possibleBonuses.length; a++) {
                options.push(possibleBonuses[a]);
            }
        }

        options.push(currentBonus);

        return options;
    };

    const runSpinner = () => {
        const options = getOptions(props.possibleBonuses);
        const top = 0 - ((options.length - 3) * 140);

        setState((prev) => {
            return {
                ...prev,
                visible: true,
                options: options,
                top: top
            };
        });

        setTimeout(() => {
            setState((prev) => {
                return {
                    ...prev,
                    visible: false,
                    top: 0,
                };
            });
        }, 5000);
    };

    useEffect(() => {
        if(props.showBonusShuffle > 0) {
            runSpinner();
        }
    }, [props.showBonusShuffle]);

    const spinnerClasses = clsx(
        "spinner",
        { ["visible"]: state.visible === true },
    );
   
    return <div className={spinnerClasses}>
        <div className="spinner-inner" style={{top: state.top + "px"}}>
            {state.options.map((option, index) => {
                return <div className={option.classString} key={index}>{option.shortName}</div>;
            })}
        </div>
    </div>
};

export default BonusSpinner;