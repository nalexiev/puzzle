import { useState, useEffect } from "react";

import "./TemplateAnimation.css";
import { CopyTile } from "../helpers/CopyTiles";
import { generateNumberOfTiles } from "../helpers/Generator";
import clsx from "clsx";

import Tile from "./Tile";

function TemplateAnimation(props) {
  const x = props.x === 0 ? 0 : (100 / 6) * props.x;
  const y = props.y === 0 ? 0 : (100 / 6) * props.y;

  const tilesFirst = generateNumberOfTiles(1017);
  const tilesSecond = generateNumberOfTiles(1017);
  const tilesThird = generateNumberOfTiles(1017);

  let timeout1;
  let timeout2;
  let timeout3;

  if(props.templateTiles.length > 0) {
    tilesFirst.push(CopyTile(props.templateTiles[0]));
    tilesFirst.push(CopyTile(props.templateTiles[3]));
    tilesFirst.push(CopyTile(props.templateTiles[6]));

    tilesSecond.push(CopyTile(props.templateTiles[1]));
    tilesSecond.push(CopyTile(props.templateTiles[4]));
    tilesSecond.push(CopyTile(props.templateTiles[7]));

    tilesThird.push(CopyTile(props.templateTiles[2]));
    tilesThird.push(CopyTile(props.templateTiles[5]));
    tilesThird.push(CopyTile(props.templateTiles[8]));
  }

  const [state, setState] = useState({
    firstClass: 'templateAnimated',
    secondClass: 'templateAnimated',
    thirdClass: 'templateAnimated',
    visible: false
  });

  const runShuffle = () => {

      timeout1 = setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            firstClass: 'templateAnimated shuffled',
            visible: true
          };
        });
      }, 0);

      timeout2 = setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            secondClass: 'templateAnimated shuffled'
          };
        });
      }, 500);

      timeout3 = setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            thirdClass: 'templateAnimated shuffled'
          };
        });
      }, 1500);

      setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            visible: false,
          };
        });

        setTimeout(() => {
          setState((prev) => {
            return {
              ...prev,
              firstClass: 'templateAnimated',
              secondClass: 'templateAnimated',
              thirdClass: 'templateAnimated'
            };
          });
        }, 500);
      }, 2500);
  };

  useEffect(() => {
    if(props.started) {
      runShuffle();
    }
  }, [props.started]);

  const templateAnimatedWrapperClasses = clsx(
    "templateAnimatedWrapper",
    { ["visible"]: state.visible === true },
  );

  return (
    <div className={templateAnimatedWrapperClasses} style={{ left: x + "%", top: y + "%" }}>
      <div className={state.firstClass}>
        {tilesFirst.map((tile, index) => {
          return <Tile key={index} tile={tile} />;
        })}
      </div>
      <div className={state.secondClass}>
        {tilesSecond.map((tile, index) => {
          return <Tile key={index} tile={tile} />;
        })}
      </div>
      <div className={state.thirdClass}>
        {tilesThird.map((tile, index) => {
          return <Tile key={index} tile={tile} />;
        })}
      </div>
    </div>
  );
}

export default TemplateAnimation;