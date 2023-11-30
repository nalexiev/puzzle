import ArrayShuffle from "./ArrayShuffle";
import { CopyTiles, CopyTile, CreateNewTile } from "./CopyTiles";
import DashboardTilesUnderPosition from "./DashboardTilesUnderPosition";
import MatchPosition from "./MatchPosition";

import {
  getRandomPerfectTile,
  getRandomNearTile,
} from "./Game";
import { generateTemplate } from "./Generator";

const newMakeAllNearToPerfectBonus = (preBonuses, x, y, dashboardTiles) => {
  const updatedBonuses = updatePreBonuses(preBonuses);

  const tilesUnderTemplate = DashboardTilesUnderPosition(
    x,
    y,
    dashboardTiles
  );

  const newTemplateTiles = CopyTiles(tilesUnderTemplate);

  return {
    preBonuses: updatedBonuses,
    templateTiles: newTemplateTiles
  };
};

const newSingleTileShuffleBonus = (preBonuses, dashboardTiles, templateTiles) => {
  const updatedPreBonuses = updatePreBonuses(preBonuses);
  const allAvailableTiles = CopyTiles(dashboardTiles);
  const allTemplateTiles = CopyTiles(templateTiles);

  let tileToReplace = null;
  const shuffledTemplateTiles = ArrayShuffle(allTemplateTiles);

  for(let i = 0; i < shuffledTemplateTiles.length; i++) {
    const templateTile = shuffledTemplateTiles[i];

    if(!templateTile.perfect && !templateTile.near) {
      tileToReplace = templateTile.index;
      break;
    }
  }

  const allTilesToChooseFrom   = [];

  const allTemplateTileIndexes = allTemplateTiles.map((item) => {
    return item.index;
  });

  const allDashboardTileIndexes = allAvailableTiles.map((item) => {
    return item.index;
  });

  for(let i = 0; i < allDashboardTileIndexes.length; i++) {
    if (allTemplateTileIndexes.indexOf(allDashboardTileIndexes[i]) === -1) {
      allTilesToChooseFrom.push(allDashboardTileIndexes[i]);
    }
  }

  const allTilesToChooseFromShuffled = ArrayShuffle(allTilesToChooseFrom);
  const choosedTileIndex = allTilesToChooseFromShuffled[0];

  for(let i = 0; i < allTemplateTiles.length; i++) {
    if(allTemplateTiles[i].index === tileToReplace) {
      allTemplateTiles[i] = CreateNewTile(choosedTileIndex);
    }
  }

  return {
    preBonuses: updatedPreBonuses,
    templateTiles: allTemplateTiles
  };
};

const newMoveNearToPerfectBonus = (preBonuses, x, y, dashboardTiles, templateTiles) => {
  const updatedPreBonuses = updatePreBonuses(preBonuses);

  const tilesUnderTemplate = DashboardTilesUnderPosition(
    x,
    y,
    dashboardTiles
  );

  const templateTilesCopy = CopyTiles(templateTiles);
  const randomNearTile = getRandomNearTile(templateTiles, false);

  for (let i = 0; i < tilesUnderTemplate.length; i++) {
    if (tilesUnderTemplate[i].index === randomNearTile.tile.index) {
      const tileIndex1 = i;
      const tileIndex2 = randomNearTile.index;

      randomNearTile.tile.perfect = true;
      randomNearTile.tile.near = false;

      templateTilesCopy[tileIndex1] = randomNearTile.tile;
      templateTilesCopy[tileIndex2] = CopyTile(templateTiles[tileIndex1]);
      templateTilesCopy[tileIndex2].near = false;
      templateTilesCopy[tileIndex2].perfect = false;

      break;
    }
  }

  return {
    preBonuses: updatedPreBonuses,
    templateTiles: templateTilesCopy
  };
};

const newSwapNearMatchesBonus = (preBonuses, x, y, dashboardTiles, templateTiles) => {
  const updatedPreBonuses = updatePreBonuses(preBonuses);
  const templateTilesCopy = [...templateTiles];
  const replacedTemplateTiles = [...templateTiles];
  const randomPerfectTile = getRandomPerfectTile(templateTiles);

  const randomNearTile1 = getRandomNearTile(templateTiles, false);
  const randomNearTile2 = getRandomNearTile(templateTiles, randomNearTile1.index);

  replacedTemplateTiles[randomNearTile1.index] = randomNearTile2;
  replacedTemplateTiles[randomNearTile2.index] = randomNearTile1;

  for (let i = 0; i < templateTilesCopy.length; i++) {
    if (!templateTilesCopy[i].perfect && !templateTilesCopy[i].near) {
      const thePerfectTile = { ...randomPerfectTile.tile };
      const theNotCollectableTile = { ...templateTilesCopy[i] };

      thePerfectTile.perfect = false;
      thePerfectTile.near = true;
      thePerfectTile.shuffled = true;

      theNotCollectableTile.perfect = false;
      theNotCollectableTile.near = false;

      replacedTemplateTiles[i] = thePerfectTile;
      replacedTemplateTiles[randomPerfectTile.index] = theNotCollectableTile;
      break;
    }
  }

  const newTemplateTilesUpdated = MatchPosition(
    [...dashboardTiles],
    replacedTemplateTiles,
    x,
    y
  );

  return {
    preBonuses: updatedPreBonuses,
    templateTiles: newTemplateTilesUpdated
  };
};

const newMovePerfectToNearBonus = (preBonuses, templateTiles) => {
  const updatedPreBonuses = updatePreBonuses(preBonuses);
  const templateTilesCopy = CopyTiles(templateTiles);
  const replacedTemplateTiles = CopyTiles(templateTiles);
  const randomPerfectTile = getRandomPerfectTile(templateTiles);

  for (let i = 0; i < templateTilesCopy.length; i++) {
    if (!templateTilesCopy[i].perfect && !templateTilesCopy[i].near) {
      const thePerfectTile = CopyTile(randomPerfectTile.tile);
      const theNotCollectableTile = CopyTile(templateTilesCopy[i]);

      thePerfectTile.perfect = false;
      thePerfectTile.near = true;
      thePerfectTile.shuffled = true;

      replacedTemplateTiles[i] = thePerfectTile;

      replacedTemplateTiles[randomPerfectTile.index] = theNotCollectableTile;
      replacedTemplateTiles[randomPerfectTile.index].perfect = false;
      replacedTemplateTiles[randomPerfectTile.index].near = false;

      break;
    }
  }

  return {
    preBonuses: updatedPreBonuses,
    templateTiles: replacedTemplateTiles
  };
};

const newNoBonus = (preBonuses, templateTiles) => {
  const updatedPreBonuses = updatePreBonuses(preBonuses);

  return {
    preBonuses: updatedPreBonuses,
    templateTiles: templateTiles
  };
};

const freeSpinBonus = (postBonuses, dashboardTiles) => {
  const updatedPostBonuses = updatePostBonuses(postBonuses);
  const newTemplateTiles = generateTemplate(dashboardTiles);

  return {
    postBonuses: updatedPostBonuses,
    templateTiles: newTemplateTiles
  };
};


const updatePostBonuses = (bonuses) => {
  let updatedBonuses = [...bonuses];

  if (updatedBonuses.length > 0) {
      if (updatedBonuses[0].times > 1) {
      updatedBonuses[0].times--;
      } else if (updatedBonuses[0].times === 1) {
      updatedBonuses.shift();
      }
  }

  return updatedBonuses;
};

const updatePreBonuses = (bonuses) => {
  let updatedBonuses = [...bonuses];

  if (updatedBonuses.length > 0) {
      if (updatedBonuses[0].times > 1) {
          updatedBonuses[0].times--;
          updatedBonuses[1].firstTime = false;
      } 
      else if (updatedBonuses[0].times === 1) {
          updatedBonuses.shift(); 
      }
  }

  return updatedBonuses;
};


export {
  newMakeAllNearToPerfectBonus,
  newSingleTileShuffleBonus,
  newMoveNearToPerfectBonus,
  newSwapNearMatchesBonus,
  newMovePerfectToNearBonus,
  updatePostBonuses,
  updatePreBonuses,
  freeSpinBonus,
  newNoBonus
};