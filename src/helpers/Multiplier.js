import MatchPosition from "./MatchPosition";
import DashboardTilesUnderPosition from "./DashboardTilesUnderPosition";
import { CopyTiles } from "./CopyTiles";

const Multiplier = (dashboardTiles, templateTiles, x, y, callback) => {
  const getNearMatchMultiplier = (nearMatchesParam, allMultipliersParam) => {
    let nearMatchTotalMultiplier = 0;
    let allMultipliersReversed = allMultipliersParam.sort().reverse();

    if (nearMatchesParam >= 4 && allMultipliersParam.length > 4) {
      let nearMatchSum = 0;

      if (nearMatchesParam <= allMultipliersParam.length) {
        nearMatchSum = nearMatchesParam;
      } else if (nearMatchesParam > allMultipliersParam.length) {
        nearMatchSum = allMultipliersParam.length;
      }

      for (let i = 0; i < nearMatchSum; i++) {
        nearMatchTotalMultiplier += allMultipliersReversed[i];
      }
    }

    return nearMatchTotalMultiplier;
  };

  const getPerfectMatchMultiplier = (
    templateTilesParam,
    dashboardTilesParam
  ) => {
    let perfectMatchTotalMultiplier = 0;
    let perfectMatchSum = 0;

    for (let i = 0; i < templateTilesParam.length; i++) {
      const tile = templateTilesParam[i];

      if (tile.perfect && dashboardTilesParam[i].multiplierBonus > 0) {
        perfectMatchSum++;
        perfectMatchTotalMultiplier += dashboardTilesParam[i].multiplierBonus;
      }
    }

    if (perfectMatchSum < 2) {
      perfectMatchTotalMultiplier = 0;
    }

    return perfectMatchTotalMultiplier;
  };

  const getMatchesSum = (matchPositionParam) => {
    let nearMatches = 0;
    let perfectMatches = 0;

    for (let i = 0; i < matchPositionParam.length; i++) {
      const tile = matchPositionParam[i];
      if (tile.perfect) {
        perfectMatches++;
      }
      if (tile.near) {
        nearMatches++;
      }
    }

    return {
      nearMatches: nearMatches,
      perfectMatches: perfectMatches,
    };
  };

  const getAllMultipliers = (dashboardPositionParam) => {
    const allMultipliers = [];

    for (let i = 0; i < dashboardPositionParam.length; i++) {
      if (dashboardPositionParam[i].multiplierBonus > 0) {
        allMultipliers.push(dashboardPositionParam[i].multiplierBonus);
      }
    }

    return allMultipliers;
  };

  const dashboardArrayCopy = CopyTiles(dashboardTiles);
  const templateTilesCopy = CopyTiles(templateTiles);

  const matchPosition = MatchPosition(dashboardArrayCopy, templateTilesCopy, x, y);
  const dashboardTilesUnderPosition = DashboardTilesUnderPosition(
    x,
    y,
    dashboardArrayCopy
  );

  const { nearMatches, perfectMatches } = getMatchesSum(matchPosition);

  const allMultipliers = getAllMultipliers(dashboardTilesUnderPosition);

  const perfectMultiplier = getPerfectMatchMultiplier(
    templateTilesCopy,
    dashboardTilesUnderPosition
  );

  const nearMatchMultiplier = getNearMatchMultiplier(
    nearMatches,
    allMultipliers
  );

  let found = false;
  let returnMultiplier = 1;

  if(nearMatches === 2 && perfectMatches === 2) {
    found = true;
  }

  if (perfectMultiplier >= nearMatchMultiplier && perfectMultiplier > 0) {
    returnMultiplier = perfectMultiplier;
  } else if (nearMatchMultiplier > 0) {
    returnMultiplier = nearMatchMultiplier;
  } 

  callback(returnMultiplier, found);
};

export default Multiplier;
