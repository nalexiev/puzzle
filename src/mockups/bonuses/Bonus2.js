const Bonus2 = () => {
  const dashboardTiles = [
    5, 35, 69, 6, 60, 75, 15, 22, 4, 65, 35, 49, 10, 53, 55, 29, 56, 45, 71, 79,
    81, 78, 66, 1, 67, 21, 46, 36, 70, 54, 48, 24, 39, 2, 23, 11,
  ];
  const templateTiles = [5, 35, 21, 46, 15, 29, 7, 54, 48];

  const dashboardGeneratedTiles = [];
  const templateGeneratedTiles = [];

  for (let i = 0; i < dashboardTiles.length; i++) {
    dashboardGeneratedTiles.push({
      index: dashboardTiles[i],
      image:
        "https://mystudio.bg/new/images/i" + (dashboardTiles[i] + 1) + ".png",
      perfect: false,
      near: false,
      collected: false,
      shuffled: false,
    });
  }

  for (let i = 0; i < templateTiles.length; i++) {
    templateGeneratedTiles.push({
      index: templateTiles[i],
      image:
        "https://mystudio.bg/new/images/i" + (templateTiles[i] + 1) + ".png",
      perfect: false,
      near: false,
      collected: false,
      shuffled: false,
    });
  }

  return {
    dashboardTiles: dashboardGeneratedTiles,
    templateTiles: templateGeneratedTiles,
  };
};

export default Bonus2;
