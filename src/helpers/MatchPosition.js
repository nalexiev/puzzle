import DashboardTilesUnderPosition from "./DashboardTilesUnderPosition";
import{ CopyTiles } from "./CopyTiles";

const MatchPosition = (dashboard, template, x, y) => {

  const dashboardArrayCopy = CopyTiles(dashboard);
  const templateTiles = CopyTiles(template);

  const dashboardTilesUnderPosition = DashboardTilesUnderPosition(
    x,
    y,
    dashboardArrayCopy
  );

  const dashboardTilesIndexesUnderPosition = [];

  for (let i = 0; i < dashboardTilesUnderPosition.length; i++) {
    dashboardTilesIndexesUnderPosition.push(
      dashboardTilesUnderPosition[i].index
    );
  }
  

  for (let a = 0; a < 9; a++) {
    const templateTile = templateTiles[a];
    const indexOf = dashboardTilesIndexesUnderPosition.indexOf(
      templateTile.index
    );

    if (indexOf !== -1 && a === indexOf && !templateTile.collected) {
      templateTiles[a].perfect = true;
      templateTiles[a].near = false;
    } else if (indexOf !== -1 && !templateTile.collected) {
      templateTiles[a].perfect = false;
      templateTiles[a].near = true;
    } else {
      templateTiles[a].perfect = false;
      templateTiles[a].near = false;
    }
  }

  return templateTiles;
};

export default MatchPosition;
