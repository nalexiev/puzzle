import Matrix from "./Matrix";

const DashboardTilesUnderPosition = (x, y, dashboard) => {
  const tilesArray = [];
  const dashboardMatrix = Matrix(dashboard, 6);

  for (let templateX = y; templateX < y + 3; templateX++) {
    for (let templateY = x; templateY < x + 3; templateY++) {
      tilesArray.push(dashboardMatrix[templateX][templateY]);
    }
  }

  return tilesArray;
};

export default DashboardTilesUnderPosition;
