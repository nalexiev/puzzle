import ArrayShuffle from "./ArrayShuffle";
import { CopyTiles } from "./CopyTiles";
import { generateTemplate } from "./Generator";


const getRandomPerfectTile = (templateTiles) => {
  let tile = null;

  const templateTilesCopy = [...templateTiles];
  const templateTilesShuffled = ArrayShuffle(templateTilesCopy);

  for (let i = 0; i < templateTilesShuffled.length; i++) {
    if (
      templateTilesShuffled[i].collected === false &&
      templateTilesShuffled[i].perfect
    ) {
      let tileIndex = null;

      for(let x = 0; x < templateTiles.length; x++) {
        if (templateTilesShuffled[i].index === templateTiles[x].index) {
          tileIndex = x;
        }
      }

      tile = {
        index: tileIndex,
        tile: { ...templateTilesShuffled[i] },
      };
    }
  }
  return tile;
};

const getRandomTileNotCollectable = (templateTiles) => {
  const templateTilesCopy = [...templateTiles];
  const templateTilesShuffled = ArrayShuffle(templateTilesCopy);
  let notCollectable = null;

  for (let i = 0; i < templateTilesShuffled.length; i++) {
    if (!templateTilesShuffled[i].perfect && !templateTilesShuffled[i].near) {
      notCollectable = templateTilesShuffled[i];
      break;
    }
  }

  return notCollectable;
};


const getRandomDashboardTile = (dashboardTilesArr, templateTilesArr, nearTile) => {
  const dashboardTiles = [...dashboardTilesArr];
  const templateTiles = [...templateTilesArr];
  const templateTilesIndexes = templateTiles.map((tile, index) => {
    return index;
  });

  let randomTile = null;

  for (let i = 0; i < dashboardTiles.length; i++) {
    if (
      nearTile.index !== dashboardTiles[i].index &&
      templateTilesIndexes.indexOf(dashboardTiles[i].index) !== -1
    ) {
      randomTile = dashboardTiles[i];
      break;
    }
  }

  return randomTile;
};


const getRandomNearTile = (templateTiles, index = false) => {
  let tile = null;
  const templateTilesCopy = CopyTiles(templateTiles);

  for (let i = 0; i < templateTilesCopy.length; i++) {
    if (
      templateTilesCopy[i].collected === false &&
      templateTilesCopy[i].near
    ) {
      if (index && templateTilesCopy[i].index === index) {
        continue;
      }

      tile = {
        index: i,
        tile: templateTilesCopy[i],
      };
    }
  }
  return tile;
};

const getCollectedTiles = (templateTilesArr) => {
  const templateTiles = CopyTiles(templateTilesArr);

  for (let i = 0; i < templateTiles.length; i++) {
    if (templateTiles[i].perfect || templateTiles[i].near) {
      templateTiles[i].collected = true;
    }
  }

  return templateTiles;
};

const onBetSizeDown = (state, betStep, setStateFn) => {
  if (state.betSize - betStep > 0) {
    setStateFn((prev) => {
      return {
        ...prev,
        betSize: prev.betSize - betStep,
      };
    });
  }
};

const onBetSizeUp = (state, betStep, setStateFn) => {
  if (state.betSize + betStep <= 100) {
    setStateFn((prev) => {
      return {
        ...prev,
        betSize: prev.betSize + betStep,
      };
    });
  }
};

const getNewTemplate = (dashboardTilesArr) => {
  const newTemplate = generateTemplate(dashboardTilesArr);

  for (let i = 0; i < newTemplate.length; i++) {
    newTemplate[i].collected = false;
    newTemplate[i].perfect = false;
    newTemplate[i].near = false;
  }

  return newTemplate;
};

const getUpdatedTemplate = (x, y, perfect, near, templateTiles) => {
  const templateCopy = CopyTiles(templateTiles);
  const perfectIndexes = perfect.map((item) => {
    return item.index;
  });
  const nearIndexes = near.map((item) => {
    return item.index;
  });

  for (let i = 0; i < templateCopy.length; i++) {
    const templateItemIndex = templateCopy[i].index;

    if(perfectIndexes.indexOf(templateItemIndex) !== -1) {
      templateCopy[i].perfect = true;
    }

    if(nearIndexes.indexOf(templateItemIndex) !== -1) {
      templateCopy[i].near = true;
    }
  }

  return templateCopy;
};

const calculateFinalWin = (setStateFn) => {
  console.log('calculateFinalWin');
  
  setStateFn((prev) => {
    return {
      ...prev,
      credits: prev.credits + prev.currentWin * prev.multiplierBonus,
      currentWin: prev.currentWin * prev.multiplierBonus,
      showStartAgain: prev.showStartAgain + 1,
      afterTheWholeGameEnded: true,
      step: 1,
      totalWin: prev.totalWin + prev.currentWin * prev.multiplierBonus,
      runShuffleAfterCalculate: prev.runShuffleAfterCalculate + 1
    };
  });
};

export {
    getRandomPerfectTile,
    getRandomTileNotCollectable,
    getRandomDashboardTile,
    getRandomNearTile,
    getCollectedTiles,
    onBetSizeDown,
    onBetSizeUp,
    getNewTemplate,
    calculateFinalWin,
    getUpdatedTemplate
}