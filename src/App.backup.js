import { useState, useEffect } from "react";

import 'animate.css';
import "./components/App.css";

import Dashboard from "./components/Dashboard";
import Template from "./components/Template";
import Controls from "./components/Controls";
import MultiplierView from "./components/MultiplierView";
import TemplateAnimation from "./components/TemplateAnimation";
import BonusSpinner from "./components/BonusSpinner";

import { CopyTiles } from "./helpers/CopyTiles";
import { generateDashboard, generateTemplate } from "./helpers/Generator";
import BestMove from "./helpers/BestMove";
import Bonus from "./helpers/Bonus";
import BonusTypes from "./helpers/BonusTypes";
import Multiplier from "./helpers/Multiplier";
import UnderDashboard from "./components/UnderDashboard";


import {
  getCollectedTiles,
  onBetSizeUp,
  onBetSizeDown,
  calculateFinalWin,
  getNewTemplate,
  getUpdatedTemplate
} from "./helpers/Game";

import {
  newMakeAllNearToPerfectBonus,
  newSingleTileShuffleBonus,
  newMoveNearToPerfectBonus,
  newSwapNearMatchesBonus,
  newMovePerfectToNearBonus,
  updatePostBonuses,
} from "./helpers/GameBonuses";

const App = () => {
  const betStep = 0.05;

  const [state, setState] = useState({
    dashboardTiles: [],
    templateTiles: [],
    position: { x: 0, y: 0 },
    credits: 10000,
    currentWin: 0,
    multiplierBonus: 1,
    betSize: 2,
    preBonuses: [],
    postBonuses: [],
    step: 1,
    afterWinChanged: false,
    afterTheWholeGameEnded: false,
    afterFreeShuffleGenerated: 0,
    initialTemplate: [],
    afterFirstTemplateMove: 0, // after the template has been moved for the first time
    afterFirstMove: 0, // after first winnable or bonusable move
    afterFirstMovePreBonuses: 0, // after first move made to check for pre bonuses
    afterFirstMoveUpdated: 0, //
    afterFirstMoveHasCollected: 0,
    afterNthTemplateMove: 0,
    afterNthTemplateUpdated: 0,
    afterPreBonusRan: 0,
    afterPostBonusRan: 0,
    bestMove: null,
    firstBestMove: null,
    afterRunPostBonus: 0,
    afterPostBonusTemplateGenerated: 0,
    afterPostBonusTemplateMoved: 0,
    afterPostBonusTemplateTilesUpdated: 0,
    afterPostBonusCollected: 0,
    bonusSpinnerVisible: false,
    bonusSpinnerBonus: null,
  });

  const showSpinner = (bonus) => {
    setState((prev) => {
      return {
        ...prev, 
        bonusSpinnerVisible: true,
        bonusSpinnerBonus: bonus
      };
    });
  };

  const hideSpinner = () => {
    setState((prev) => {
      return {
        ...prev, 
        bonusSpinnerVisible: false,
        bonusSpinnerBonus: null
      };
    });
  };

  const afterNewTemplateShuffledCallback = () => {
    const bestMove = BestMove(
      state.dashboardTiles,
      state.templateTiles,
      state.betSize,
      state.step
    );

    if (bestMove !== null && bestMove.winnable) {
      setState((prev) => {
        return {
          ...prev,
          afterPostBonusTemplateMoved: prev.afterPostBonusTemplateMoved + 1,
          position: {
            x: bestMove.x,
            y: bestMove.y
          }
        };
      });
    }
    else {
      // check for next post bonus
    }
  };

  // 1.
  const onFirstShuffle = () => {
    if (state.betSize <= state.credits) {
      console.clear();
      console.log('1. onFirstShuffle');

      const dashboardTiles = generateDashboard();
      const templateTiles = generateTemplate(dashboardTiles);

      setState((prev) => {
        return {
          ...prev,
          step: 1,
          started: true,
          currentWin: 0,
          dashboardTiles: dashboardTiles,
          templateTiles: templateTiles,
          initialTemplate: templateTiles,
          credits: prev.credits - prev.betSize,
        };
      });
    }
  };


  // 2.
  const afterFirstTemplateAnimation = () => {    
    console.log('2. afterFirstTemplateAnimation');

    const bestMove = BestMove(state.dashboardTiles, state.templateTiles, state.betSize, state.step);    
    
    if (bestMove === null) {
      calculateFinalWin(setState);
    }
    else {

      Multiplier(
        state.dashboardTiles,
        state.templateTiles,
        state.position.x,
        state.position.y,
        (multiplier) => {

          console.log('MULTIPLIER IS ', multiplier);

          setState((prev) => {
            return {
              ...prev,
              multiplierBonus: multiplier,
              bestMove: bestMove,
              firstBestMove: bestMove,
              step: prev.step + 1,
              afterFirstTemplateMove: prev.afterFirstTemplateMove + 1,
              position: {
                x: bestMove.x,
                y: bestMove.y
              }
            };
          });
        }
      );
    }
  };

  // 3.
  const afterFirstTemplateMove = () => {
    if (state.afterFirstTemplateMove > 0) {
      console.log('3. afterFirstTemplateMove');

      setTimeout(() => {
        let bonuses = {
          preBonuses: [],
          postBonuses: []
        };

        if (state.bestMove !== null) {
          bonuses = Bonus(
            state.bestMove.perfect.length,
            state.bestMove.near.length
          );
        }

        if (state.bestMove !== null) {
          const updatedTiles = getUpdatedTemplate(
            state.bestMove.x, 
            state.bestMove.y, 
            state.bestMove.perfect, 
            state.bestMove.near,
            state.templateTiles
          );

          console.log('PRE BONUSES', bonuses.preBonuses);
          console.log('POST BONUSES', bonuses.postBonuses);

          setState((prev) => {
            return {
              ...prev,
              currentWin: prev.currentWin + (state.bestMove.winnable ? state.bestMove.award : 0),
              preBonuses: bonuses.preBonuses,
              postBonuses: bonuses.postBonuses,
              templateTiles: updatedTiles,
              afterFirstMoveUpdated: prev.afterFirstMoveUpdated + 1,
            };
          });
        }
        else if(bonuses.preBonuses.length) {
          console.log('preBonuses');
          console.log(bonuses.preBonuses);
          calculateFinalWin(setState);
        }
        else if(bonuses.postBonuses.length) {
          console.log('postBonuses');
          console.log(bonuses.postBonuses);
          calculateFinalWin(setState);
        }
        else {
          calculateFinalWin(setState);
        }
      }, animationTimeout);
      
    }
  };
  useEffect(afterFirstTemplateMove, [state.afterFirstTemplateMove]);

  const afterNthTemplateMove = () => {
    if (state.afterNthTemplateMove > 0) {
      const updatedTiles = getUpdatedTemplate(
        state.bestMove.x, 
        state.bestMove.y, 
        state.bestMove.perfect, 
        state.bestMove.near,
        state.templateTiles
      );
      
      setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            templateTiles: updatedTiles,
            afterNthTemplateUpdated: prev.afterNthTemplateUpdated + 1,
          };
        });
      }, animationTimeout);
    }
  };
  useEffect(afterNthTemplateMove, [state.afterNthTemplateMove]);

  const afterNthTemplateUpdated = () => {
    if (state.afterNthTemplateUpdated > 0) {
      const collectingTiles = getCollectedTiles(state.templateTiles);

      setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            templateTiles: collectingTiles,
            currentWin: prev.currentWin + prev.bestMove.award
          };
        });
      }, animationTimeout);
    }
  };
  useEffect(afterNthTemplateUpdated, [state.afterNthTemplateUpdated]);

  const afterFirstMoveHasCollected = () => {
    if(state.afterFirstMoveHasCollected > 0) {

      const bestMove = BestMove(state.dashboardTiles, state.templateTiles, state.betSize, state.step);

      if (state.preBonuses.length) {
        // const beforeFirstCollectTemplateTiles = CopyTiles(state.initialTemplate);
        // setTimeout(() => {
        //   setState((prev) => {
        //     return {
        //       ...prev,
        //       templateTiles: beforeFirstCollectTemplateTiles
        //     };
        //   });
        // }, animationTimeout);
        calculateFinalWin(setState);
      }
      else if(bestMove !== null && bestMove.winnable) {
        setTimeout(() => {
          setState((prev) => {
            return {
              ...prev,
              bestMove: bestMove,
              afterNthTemplateMove: prev.afterNthTemplateMove + 1,
              position: {
                x: bestMove.x,
                y: bestMove.y
              }
            };
          });
        }, animationTimeout);
      }
      else if (state.postBonuses.length > 0) {
        // setTimeout(() => {
        //   runAllPostBonuses();
        // }, animationTimeout);
        calculateFinalWin(setState);
      }
      else {
        calculateFinalWin(setState);
      }
    }
  };
  useEffect(afterFirstMoveHasCollected, [state.afterFirstMoveHasCollected]);

  const afterPreBonusRan = () => {
    if (state.afterPreBonusRan > 0) {
      console.log('afterPreBonusRan');

      const bestMove = BestMove(
        state.dashboardTiles,
        state.templateTiles,
        state.betSize,
        state.step
      );

      if (bestMove.winnable) {
        const collectedTiles = getCollectedTiles(state.templateTiles);
        
        setTimeout(() => {
          setState((prev) => {
            return {
              ...prev,
              currentWin: prev.currentWin + bestMove.award,
              templateTiles: collectedTiles,
            };
          }); 
        }, animationTimeout);
      }
      else {
        console.log("The bonus is not winnable");
      }
    }
  }
  useEffect(afterPreBonusRan, [state.afterPreBonusRan]);

  const afterPostBonusRan = () => {
    if (state.afterPostBonusRan > 0) {
      console.log('afterPostBonusRan');
    }
  }
  useEffect(afterPostBonusRan, [state.afterPostBonusRan]);

  const runAllPreBonuses = () => {
    console.log('runAllPreBonuses');
    console.log(state.preBonuses[0]);

    showSpinner(
      state.preBonuses[0].bonus,
      'PRE_BONUS'
    );
  };

  const runAllPostBonuses = () => {
    console.log('runAllPostBonuses');
    console.log(state.postBonuses[0]);

    showSpinner(
      state.postBonuses[0].bonus,
      'POST_BONUS'
    );
  };

  const afterFreeShuffleGenerated = () => {
    if (state.afterFreeShuffleGenerated > 0) {
      console.log('afterFreeShuffleGenerated');
    }
  };
  useEffect(afterFreeShuffleGenerated, [state.afterFreeShuffleGenerated]);

  const afterPostBonusTemplateGenerated = () => {
    if (state.afterPostBonusTemplateGenerated > 0) {
      
    }
  };
  useEffect(afterPostBonusTemplateGenerated, [state.afterPostBonusTemplateGenerated]);

  const afterPostBonusTemplateMoved = () => {
    if (state.afterPostBonusTemplateMoved > 0) {
      const bestMove = BestMove(
        state.dashboardTiles,
        state.templateTiles,
        state.betSize,
        state.step
      );

      const updatedTiles = getUpdatedTemplate(
        bestMove.x, 
        bestMove.y, 
        bestMove.perfect, 
        bestMove.near,
        state.templateTiles
      );

      setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            templateTiles: updatedTiles,
            afterPostBonusTemplateTilesUpdated: prev.afterPostBonusTemplateTilesUpdated + 1,
          };
        });
      }, animationTimeout);
    }
  };
  useEffect(afterPostBonusTemplateMoved, [state.afterPostBonusTemplateMoved]);

  const afterPostBonusTemplateTilesUpdated = () => {
    if (state.afterPostBonusTemplateTilesUpdated > 0) {
      const collectedTiles = getCollectedTiles(state.templateTiles);

      const bestMove = BestMove(
        state.dashboardTiles,
        state.templateTiles,
        state.betSize,
        state.step
      );

      setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            currentWin: prev.currentWin + bestMove.award,
            templateTiles: collectedTiles,
            afterPostBonusCollected: prev.afterPostBonusCollected + 1,
          };
        }); 
      }, animationTimeout);
      
    }
  };
  useEffect(afterPostBonusTemplateTilesUpdated, [state.afterPostBonusTemplateTilesUpdated]);

  const afterPostBonusCollected = () => {
    if (state.afterPostBonusCollected > 0) {
      if (state.postBonuses.length) {
        setTimeout(() => {
          runAllPostBonuses();
        }, animationTimeout);
      }
      else {
        calculateFinalWin(setState);
      }
    }
  };
  useEffect(afterPostBonusCollected, [state.afterPostBonusCollected]);

  const afterFirstMoveUpdated = () => {
    if (state.afterFirstMoveUpdated > 0) {  
      if (state.bestMove !== null && state.bestMove.winnable) {
        const collectedTiles = getCollectedTiles(state.templateTiles);

        setTimeout(() => {
          console.log('check for next winnable move');
          setState((prev) => {
            return {
              ...prev,
              templateTiles: collectedTiles,
              afterFirstMoveHasCollected: prev.afterFirstMoveHasCollected + 1
            };
          });
        }, animationTimeout);
      }
      else if (state.preBonuses.length > 0) {
        setTimeout(() => {
          runAllPreBonuses();
        }, animationTimeout);
      }
      else if (state.postBonuses.length > 0) {
        setTimeout(() => {
          runAllPostBonuses();
        }, animationTimeout);
      }
      else {
        calculateFinalWin(setState); 
      }
    }
  };
  useEffect(afterFirstMoveUpdated, [state.afterFirstMoveUpdated]);

  


  const afterCurrentWinChanged = () => {
    if(state.currentWin > 0) {
      setState((prev) => {
        return {
          ...prev,
          afterWinChanged: true
        };
      });

      setTimeout(() => {
        setState((prev) => {
          return {
            ...prev,
            afterWinChanged: false
          };
        });
      //}, 0);
       }, 500);

    }
    else {
      setState((prev) => {
        return {
          ...prev,
          afterWinChanged: false
        };
      });
    }
  };
  useEffect(afterCurrentWinChanged, [state.currentWin]);

  const animationTimeout = 2000;

  const runCurrentPreBonus = () => {
    const preBonus = state.preBonuses[0].bonus;
    const times = state.preBonuses[0].times;

    switch (preBonus) {
      //2
      case BonusTypes.MOVE_NEAR_TO_BECOME_PERFECT.index:
        console.log("READY: MOVE_NEAR_TO_BECOME_PERFECT");
        newMoveNearToPerfectBonus(state, setState, animationTimeout, times, true);
        break;
      //3
      case BonusTypes.SINGLE_TILE_SHUFFLE.index:
        console.log("READY: SINGLE_TILE_SHUFFLE");
        newSingleTileShuffleBonus(state, setState, animationTimeout, times, true);
        break;
      //4
      case BonusTypes.MOVE_PERFECT_TO_NEAR.index:
        console.log("READY: MOVE_PERFECT_TO_NEAR");
        newMovePerfectToNearBonus(state, setState, animationTimeout, times, true);
        break;
      //5
      case BonusTypes.SWAP_NEAR_TILES.index:
        console.log("READY: SWAP_NEAR_TILES");
        newSwapNearMatchesBonus(state, setState, animationTimeout, times, true);
        break;
      //6
      case BonusTypes.MAKE_ALL_NEAR_TO_PERFECT.index:
        console.log("READY: MAKE_ALL_NEAR_TO_PERFECT");
        newMakeAllNearToPerfectBonus(state, setState, animationTimeout, times, true);
        break;

      default:
        console.log("DEFAULT");
    }
  };

  const runCurrentPostBonus = () => {
    const updatedPostBonuses = updatePostBonuses(state.postBonuses);
    const newTemplate = getNewTemplate(state.dashboardTiles);

    setState((prev) => {
      return {
        ...prev,
        templateTiles: newTemplate,
        postBonuses: updatedPostBonuses,
        afterFreeShuffleGenerated: prev.afterFreeShuffleGenerated + 1,
      };
    });
  };

  const afterBonusSpinnerRotation = () => {
    console.log('afterBonusSpinnerRotation');
    console.log(state.bonusSpinnerBonus);
    const currentBonus = state.bonusSpinnerBonus;

    hideSpinner(); 

    setTimeout(() => {
      if (currentBonus === 'PRE_BONUS') {
        runCurrentPreBonus();
      }
      else {
        runCurrentPostBonus();
      }
    }, 1000);
  };

  return (
    <>
      <Dashboard visible={state.started} tiles={state.dashboardTiles}>
        <UnderDashboard>
          <Dashboard x={state.position.x} y={state.position.y} visible={state.started} tiles={state.dashboardTiles}></Dashboard>
        </UnderDashboard>
        <Template
          x={state.position.x}
          y={state.position.y}
          tiles={state.templateTiles}
        ></Template>
        {state.afterTheWholeGameEnded && state.multiplierBonus > 1 && (
          <MultiplierView multiplier={state.multiplierBonus} />
        )}
        <TemplateAnimation 
          afterShuffled={afterFirstTemplateAnimation}
          afterNewTemplateShuffled={afterNewTemplateShuffledCallback}
          x={state.position.x}
          y={state.position.y} 
          afterFreeShuffleGenerated={state.afterFreeShuffleGenerated}
          dashboardTiles={state.dashboardTiles}
          templateTiles={state.templateTiles} 
        />
      </Dashboard>

      <Controls
        step={state.step}
        started={state.started}
        currentWin={state.currentWin}
        afterWinChanged={state.afterWinChanged}
        credits={state.credits}
        betSize={state.betSize}
        onBetSizeUp={() => { onBetSizeUp(state, betStep, setState); }}
        onBetSizeDown={() => { onBetSizeDown(state, betStep, setState); }}
        onShuffle={onFirstShuffle}
      />

      <BonusSpinner 
        visible={state.bonusSpinnerVisible} 
        afterRotation={ afterBonusSpinnerRotation } 
      />
    </>
  );
};

export default App;
