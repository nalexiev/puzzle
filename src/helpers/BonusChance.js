import RandomInt from "./RandomInt";

const BonusChance = (bonus) => {
  
  let bonusWon = {
    bonus: null,
    times: 0,
    possibleBonuses: []
  };

  if (bonus.chance < 100) {
    const dividable = 100 / bonus.chance;
    const randomChance = RandomInt(0, dividable);

    if (randomChance === dividable) {
      bonusWon = {
        bonus: bonus.bonuses[1],
        times: 1,
        possibleBonuses: [
          bonus.bonuses[0],
          bonus.bonuses[1]
        ]
      };
    } else {
      bonusWon = {
        bonus: bonus.bonuses[0],
        times: 1,
        possibleBonuses: [
          bonus.bonuses[0],
          bonus.bonuses[1]
        ]
      };
    }
  } else {
    const times = bonus.chance / 100;
    bonusWon = {
      bonus: bonus.bonuses[1],
      times: times,
      possibleBonuses: [
        bonus.bonuses[0],
        bonus.bonuses[1]
      ]
    };
  }

  return bonusWon;
};

export default BonusChance;
