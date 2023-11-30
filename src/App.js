import { useState, useEffect } from "react";
import useSound from 'use-sound';

import 'animate.css';
import "./components/App.css";

import Dashboard from "./components/Dashboard";
import Template from "./components/Template";
import Controls from "./components/Controls";
import MultiplierView from "./components/MultiplierView";
import TemplateAnimation from "./components/TemplateAnimation";
import BonusSpinner from "./components/BonusSpinner";

import { CopyTiles, CopyTile } from "./helpers/CopyTiles";
import { generateDashboard, generateTemplate } from "./helpers/Generator";
import BestMove from "./helpers/BestMove";
import Bonus from "./helpers/Bonus";
import BonusTypes from "./helpers/BonusTypes";
import Multiplier from "./helpers/Multiplier";
import UnderDashboard from "./components/UnderDashboard";

import shuffleSound from "../src/sounds/shuffle.wav";
import winSound from "../src/sounds/win.wav";
import endGame from "../src/sounds/end.wav";

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
  freeSpinBonus,
  newNoBonus,
  updatePostBonuses,
} from "./helpers/GameBonuses";

const App = () => {
  const betStep = 0.05;
  const betSize = 0.2;
  let step = 1;

  const [shuffleSoundEffect] = useSound(shuffleSound);
  const [winSoundEffect] = useSound(winSound);
  const [endEffect] = useSound(endGame);

  const [state, setState] = useState({
    dashboardTiles: [],
    templateTiles: [],
    position: { x: 0, y: 0 },
    credits: 10000,
    currentWin: 0,
    multiplierBonus: 1,
    betSize: 2,
    step: 1,
    started: false,
    roundStarted: 0
  });

  useEffect(() => {
    if(state.roundStarted > 0) {
      // @todo
    }
  }, [state.roundStarted]);

  const reloadNewGame = () => {
    console.clear();

    let dashboardTiles = [];
    let templateTiles = [];
    let initialTemplate = [];
    let hasStarted = false;
    
    const position = {
      x: 0,
      y: 0
    };
    const appSteps = [];
    let preBonuses = [];
    let postBonuses = [];
    let currentWin = 0;
    let currentStep = 1;
    let currentCredits = state.credits;

    const addAppStep = (stepType, args) => {
      appSteps.push({
        stepType: stepType,
        args: args
      });
    };

    const setHasStarted = (started) => {
      hasStarted = started;
    };

    const setCurrentCredits = (credits) => {
      currentCredits = credits;
    };

    const setCurrentDashboardTiles = (generatedDashboardTiles) => {
      dashboardTiles = generatedDashboardTiles;
    };

    const setCurrentTemplateTiles = (generatedTemplateTiles) => {
      templateTiles = generatedTemplateTiles;
    };

    const moveTemplate = (x, y) => {
      position.x = x;
      position.y = y;
    };

    const setCurrentStep = (step) => {
      currentStep = 0;
    };

    const markTemplateTiles = (perfect, near, templateTilesParam) => {
      const newTemplateTiles = [];
      const perfectIds = perfect.map((item) => {
        return item.index;
      });
      const nearIds = near.map((item) => {
        return item.index;
      });

      for(let x = 0; x < templateTilesParam.length; x++) {
        newTemplateTiles[x] = CopyTile(templateTilesParam[x]);

        if (perfectIds.indexOf(newTemplateTiles[x].index) !== -1) {
          newTemplateTiles[x].perfect = true;
        }
        if (nearIds.indexOf(templateTiles[x].index) !== -1) {
          newTemplateTiles[x].near = true;
        }
      }
      
      return newTemplateTiles;
    };
  
    const collectTemplateTiles = (perfect, near, templateTilesParam) => {
      const newTemplateTiles = [];
      const perfectIds = perfect.map((item) => {
        return item.index;
      });
      const nearIds = near.map((item) => {
        return item.index;
      });

      for(let x = 0; x < templateTilesParam.length; x++) {
        newTemplateTiles[x] = CopyTile(templateTilesParam[x]);

        if (perfectIds.indexOf(newTemplateTiles[x].index) !== -1) {
          newTemplateTiles[x].collected = true;
          newTemplateTiles[x].perfect = false;
          newTemplateTiles[x].near = false;
        }
        if (nearIds.indexOf(templateTiles[x].index) !== -1) {
          newTemplateTiles[x].collected = true;
          newTemplateTiles[x].perfect = false;
          newTemplateTiles[x].near = false;
        }
      }
      
      return newTemplateTiles;
    };
  
    const setCurrentWin = (winAmount) => {
      currentWin += winAmount;
    };

    const generatedDashboardArray = generateDashboard();
    const generatedTemplateArray = generateTemplate(generatedDashboardArray);

    setCurrentCredits(state.credits - state.betSize);
    addAppStep("setCurrentCredits", {
      credits: currentCredits,
      currentWin: 0,
      timeout: 0
    });

    setCurrentDashboardTiles(generatedDashboardArray);
    addAppStep("setCurrentDashboardTiles", {
      dashboard: dashboardTiles,
      timeout: 0
    });

    initialTemplate = generatedTemplateArray;
    setCurrentTemplateTiles(generatedTemplateArray);
    addAppStep("setCurrentTemplateTiles", {
      template: templateTiles,
      timeout: 0
    });

    setHasStarted(true);
    addAppStep("setHasStarted", {
      started: true,
      timeout: 3500
    });

    const finalizeRound = () => {
      setCurrentCredits(currentCredits + currentWin);
      addAppStep("setCurrentCredits", {
        credits: currentCredits,
        currentWin: currentWin,
        timeout: 0
      });

      setCurrentStep(1);
      addAppStep("setCurrentStep", {
        currentStep: 1,
        timeout: 0
      });
    };

    const runPreBonuses = () => {
      if(preBonuses.length === 0) {
        console.log("NO PRE BONUSES");
        runPostBonuses();
        return;
      }

      console.log("preBonuses");

      const bestMove = BestMove(
        dashboardTiles,
        templateTiles,
        state.betSize,
        currentStep
      );

      addAppStep("showBonusShuffle", {
        bonus: preBonuses[0]
      });

      moveTemplate(bestMove.x, bestMove.y);
      addAppStep("moveTemplate", {
        x: position.x,
        y: position.y,
        timeout: 1000
      });

      templateTiles = markTemplateTiles(bestMove.perfect, bestMove.near, templateTiles);
      addAppStep("markTemplateTiles", {
        templateTiles: templateTiles,
        timeout: 1000
      });

      let bonusResult;

      switch(preBonuses[0].bonus) {

        case BonusTypes.MOVE_NEAR_TO_BECOME_PERFECT.index:
          bonusResult = newMoveNearToPerfectBonus(preBonuses, position.x, position.y, dashboardTiles, templateTiles);
        break;

        case BonusTypes.SINGLE_TILE_SHUFFLE.index:
          bonusResult = newSingleTileShuffleBonus(preBonuses, dashboardTiles, templateTiles);
        break;

        case BonusTypes.MOVE_PERFECT_TO_NEAR.index:
          bonusResult = newMovePerfectToNearBonus(preBonuses, templateTiles);
        break;

        case BonusTypes.SWAP_NEAR_TILES.index:
          bonusResult = newSwapNearMatchesBonus(preBonuses, position.x, position.y, dashboardTiles, templateTiles);
        break;

        case BonusTypes.MAKE_ALL_NEAR_TO_PERFECT.index:
          bonusResult = newMakeAllNearToPerfectBonus(preBonuses, position.x, position.y, dashboardTiles);
        break;

        case BonusTypes.NO_BONUS.index:
          bonusResult = newNoBonus(preBonuses, templateTiles);
        break;
      }

      preBonuses = bonusResult.preBonuses;

      const bestMatchBonus = BestMove(
        dashboardTiles,
        bonusResult.templateTiles,
        state.betSize,
        currentStep,
        position.x,
        position.y
      );

      if (bestMatchBonus !== null) {
        templateTiles = markTemplateTiles(bestMatchBonus.perfect, bestMatchBonus.near, bonusResult.templateTiles);            
        addAppStep("markTemplateTiles", {
          templateTiles: templateTiles,
          timeout: 1000
        });

        if (bestMatchBonus.winnable) {
          templateTiles = collectTemplateTiles(bestMatchBonus.perfect, bestMatchBonus.near, bonusResult.templateTiles);
          addAppStep("collectTemplateTiles", {
            templateTiles: templateTiles,
            timeout: 1000
          });

          setCurrentWin(bestMatchBonus.award);
          addAppStep("setCurrentWin", {
            currentWin: currentWin,
            timeout: 0
          });
        }
      }

      runPreBonuses();
    };

    const runPostBonuses = () => {
      if(postBonuses.length === 0) {
        console.log("NO POST BONUSES");
        finalizeRound();
        return;
      }

      console.log("postBonuses");

      addAppStep("showBonusShuffle", {
        bonus: postBonuses[0]
      });

      let bonusResult;

      switch(postBonuses[0].bonus) {
        case BonusTypes.FREE_SPIN.index:
          console.log(BonusTypes.FREE_SPIN.shortName);
          bonusResult = freeSpinBonus(preBonuses, dashboardTiles);
        break;
      }

      postBonuses = bonusResult.postBonuses;

      const bestMatchBonus = BestMove(
        dashboardTiles,
        bonusResult.templateTiles,
        state.betSize,
        currentStep
      );

      if (bestMatchBonus !== null) {

        setCurrentTemplateTiles(bonusResult.templateTiles);
        addAppStep("setCurrentTemplateTiles", {
          template: bonusResult.templateTiles,
          timeout: 0
        });

        setHasStarted(true);
        addAppStep("setHasStarted", {
          started: true,
          timeout: 3500
        });

        moveTemplate(bestMatchBonus.x, bestMatchBonus.y);
        addAppStep("moveTemplate", {
          x: bestMatchBonus.x,
          y: bestMatchBonus.y,
          timeout: 1000
        });

        templateTiles = markTemplateTiles(bestMatchBonus.perfect, bestMatchBonus.near, bonusResult.templateTiles);            
        addAppStep("markTemplateTiles", {
          templateTiles: templateTiles,
          timeout: 1000
        });

        if(bestMatchBonus.winnable) {
          templateTiles = collectTemplateTiles(bestMatchBonus.perfect, bestMatchBonus.near, bonusResult.templateTiles);
          addAppStep("collectTemplateTiles", {
            templateTiles: templateTiles,
            timeout: 1000
          });

          setCurrentWin(bestMatchBonus.award);
          addAppStep("setCurrentWin", {
            currentWin: currentWin,
            timeout: 0
          });
        }
      }

      runPostBonuses();
    };

    const checkForNextWin = () => {
      const bestMove = BestMove(
        dashboardTiles,
        templateTiles,
        state.betSize,
        currentStep
      );

      if (currentStep === 1) {
        const bonuses = Bonus(
          bestMove.perfect.length,
          bestMove.near.length
        );

        preBonuses = bonuses.preBonuses;
        postBonuses = bonuses.postBonuses;

        console.log(bonuses);
      }

      if ((bestMove === null || bestMove.winnable === false) && preBonuses.length === 0 && postBonuses.length === 0) {
        finalizeRound();
        return;
      }
      else if (bestMove !== null) {
        
        setCurrentStep(currentStep + 1);
        addAppStep("setCurrentStep", {
          currentStep: currentStep,
          timeout: 1000
        });

        moveTemplate(bestMove.x, bestMove.y);
        addAppStep("moveTemplate", {
          x: position.x,
          y: position.y,
          timeout: 1000
        });
  
        templateTiles = markTemplateTiles(bestMove.perfect, bestMove.near, templateTiles);
        addAppStep("markTemplateTiles", {
          templateTiles: templateTiles,
          timeout: 1000
        });

        if (bestMove.winnable) {
          templateTiles = collectTemplateTiles(bestMove.perfect, bestMove.near, templateTiles);
          addAppStep("collectTemplateTiles", {
            templateTiles: templateTiles,
            timeout: 1000
          });

          setCurrentWin(bestMove.award);
          addAppStep("setCurrentWin", {
            currentWin: currentWin,
            timeout: 0
          });

          checkForNextWin();
          return;
        }
        else {
          runPreBonuses();
          return;
        }
      }
      else if (bestMove === null || bestMove.winnable === false) {
        runPreBonuses();
      }
    };

    checkForNextWin();
    console.log(appSteps);
    processSteps(appSteps);
  };

  const processSteps = (steps) => {
    const currentSteps = [...steps];

    if (currentSteps.length > 0) {
      const currentStepToExecute = currentSteps[0];

      switch(currentStepToExecute.stepType) {
        case "setCurrentCredits":
          setState((prev) => {
            return {
              ...prev,
              credits: currentStepToExecute.args.credits,
              currentWin: currentStepToExecute.args.currentWin
            };
          });
          break;

        case "setCurrentDashboardTiles":
          setState((prev) => {
            return {
              ...prev,
              dashboardTiles: currentStepToExecute.args.dashboard
            };
          });
          break;

        case "setCurrentTemplateTiles":
          setState((prev) => {
            return {
              ...prev,
              templateTiles: currentStepToExecute.args.template
            };
          });
        break;

        case "setHasStarted":
          shuffleSoundEffect();
          setState((prev) => {
            return {
              ...prev,
              started: currentStepToExecute.args.started,
              roundStarted: prev.roundStarted + 1
            };
          });
        break;

        case "moveTemplate":
          setState((prev) => {
            return {
              ...prev,
              position: {
                x: currentStepToExecute.args.x,
                y: currentStepToExecute.args.y
              }
            };
          });
        break;

        case "markTemplateTiles":
          setState((prev) => {
            return {
              ...prev,
              templateTiles: currentStepToExecute.args.templateTiles
            };
          });
        break;

        case "collectTemplateTiles":
          winSoundEffect();
          setState((prev) => {
            return {
              ...prev,
              templateTiles: currentStepToExecute.args.templateTiles
            };
          });
        break;

        case "setCurrentWin":
          setState((prev) => {
            return {
              ...prev,
              currentWin: currentStepToExecute.args.currentWin
            };
          });
        break;
        
        case "showBonusShuffle":
          // console.log("showBonusShuffle");
          // console.log(currentStepToExecute.args.bonus);
        break;

        case "setCurrentStep":
          if(currentStepToExecute.args.currentStep === 1) {
            endEffect();
          }
          setState((prev) => {
            return {
              ...prev,
              step: currentStepToExecute.args.currentStep
            };
          });
        break;
      }

      currentSteps.shift();
      setTimeout(() => {
        processSteps(currentSteps);
      }, currentStepToExecute.args.timeout);

    }
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
        <TemplateAnimation 
          started={state.roundStarted}
          x={state.position.x}
          y={state.position.y} 
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
        onShuffle={reloadNewGame}
      />
    </>
  );
  
};

export default App;
