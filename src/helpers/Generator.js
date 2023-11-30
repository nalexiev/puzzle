import ArrayShuffle from "./ArrayShuffle";
import RandomInt from "./RandomInt";

const generateNumberOfTiles = (numOfTiles) => {
  const newGeneratedTiles = [];

  for(let i = 0; i < numOfTiles; i++) {
    const index = RandomInt(1, 81);
    newGeneratedTiles.push({
      index: index,
      image: "https://mystudio.bg/new/images/i" + (index + 1) + ".png",
      perfect: false,
      near: false,
      collected: false,
      shuffled: false,
      multiplierBonus: 0,
    });
  }

  return newGeneratedTiles;
};

const generateDashboard = () => {
  const generatedDashboardTiles = [];
  const generatedIndexes = [];

  const totalBonuses = RandomInt(0, 9);
  const multiplierBonuses = [];

  while (generatedDashboardTiles.length < 36) {
    let currentBonus;

    if (multiplierBonuses.length < totalBonuses) {
      currentBonus = RandomInt(2, 9);
      multiplierBonuses.push(currentBonus);
    } else {
      currentBonus = 0;
    }

    const index = Math.floor(Math.random() * 82);
    if (generatedIndexes.indexOf(index) === -1) {
      generatedIndexes.push(index);
      generatedDashboardTiles.push({
        index: index,
        image: "https://mystudio.bg/new/images/i" + (index + 1) + ".png",
        perfect: false,
        near: false,
        collected: false,
        shuffled: false,
        multiplierBonus: currentBonus,
      });
    }
  }

  const generatedDashboardTilesShuffled = ArrayShuffle(generatedDashboardTiles);

  return generatedDashboardTilesShuffled;
};

const generateTemplate = (tiles) => {
  const generatedTemplateTiles = [];
  const generatedIndexes = [];
  const tilesCopy = [...tiles];

  while (generatedTemplateTiles.length < 9) {
    const indexOfArray = Math.floor(Math.random() * tilesCopy.length);
    const index = tilesCopy[indexOfArray].index;

    if (generatedIndexes.indexOf(index) === -1) {
      generatedIndexes.push(index);
      generatedTemplateTiles.push({
        index: index,
        image: "https://mystudio.bg/new/images/i" + (index + 1) + ".png",
        perfect: false,
        near: false,
        collected: false,
        shuffled: false,
      });
    }
  }

  return generatedTemplateTiles;
};

export { generateDashboard, generateTemplate, generateNumberOfTiles };
