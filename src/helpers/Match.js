import Matrix from "./Matrix";
import { CopyTiles } from "./CopyTiles";

const Match = (dashboardArray, templateArray) => {
  const getDashboardPositions = (dashboard) => {
    var dashboardArrays = [];

    for (let x = 0; x <= 3; x++) {
      for (let y = 0; y <= 3; y++) {
        const templateArr = [];

        for (let templateX = 0; templateX < 3; templateX++) {
          for (let templateY = 0; templateY < 3; templateY++) {
            templateArr.push(dashboard[x + templateX][y + templateY]);
          }
        }

        dashboardArrays.push({
          x: y,
          y: x,
          tiles: templateArr,
          perfect: [],
          near: [],
        });
      }
    }

    return dashboardArrays;
  };

  const dashboardArrayCopy = CopyTiles(dashboardArray);
  const templateArrayCopy = CopyTiles(templateArray);

  const dashboardMatrix = Matrix(dashboardArrayCopy, 6);
  const dashboardPositions = getDashboardPositions(dashboardMatrix);

  for (let i = 0; i < dashboardPositions.length; i++) {
    const currentPosition = dashboardPositions[i];
    const tileIndexes = currentPosition.tiles.map((tile) => {
      return tile.index;
    });

    for (let a = 0; a < 9; a++) {
      const templateTile = templateArrayCopy[a];
      const indexOf = tileIndexes.indexOf(templateTile.index);

      if (indexOf !== -1 && a === indexOf && !templateTile.collected) {
        dashboardPositions[i].perfect.push(templateTile);
      } else if (indexOf !== -1 && !templateTile.collected) {
        dashboardPositions[i].near.push(templateTile);
      }
    }
  }

  return dashboardPositions;
};

export default Match;
