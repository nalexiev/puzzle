import BonusChance from "./BonusChance";
import BonusTypes from "./BonusTypes";

const PN_Set = [
  {
    perfect: 1,
    near: 2,
    bonuses: [0, 1],
    chance: 25,
  },
  {
    perfect: 2,
    near: 1,
    bonuses: [0, 2],
    chance: 25,
  },
  {
    perfect: 1,
    near: 3,
    bonuses: [1, 3],
    chance: 50,
  },
  {
    perfect: 3,
    near: 1,
    bonuses: [0, 2],
    chance: 50,
  },
  {
    perfect: 1,
    near: 4,
    bonuses: [0, 4],
    chance: 50,
  },
  {
    perfect: 4,
    near: 1,
    bonuses: [0, 2],
    chance: 100,
  },
  {
    perfect: 5,
    near: 0,
    bonuses: [0, 1],
    chance: 200,
  },
  {
    perfect: 1,
    near: 5,
    bonuses: [0, 4],
    chance: 50,
  },
  {
    perfect: 3,
    near: 3,
    bonuses: [0, 1],
    chance: 200,
  },
  {
    perfect: 4,
    near: 2,
    bonuses: [0, 3],
    chance: 100,
  },
  {
    perfect: 5,
    near: 1,
    bonuses: [0, 1],
    chance: 100,
  },
  {
    perfect: 6,
    near: 0,
    bonuses: [0, 3],
    chance: 200,
  },
  {
    perfect: 0,
    near: 7,
    bonuses: [0, 3],
    chance: 100,
  },
  {
    perfect: 1,
    near: 6,
    bonuses: [0, 4],
    chance: 100,
  },
  {
    perfect: 2,
    near: 5,
    bonuses: [0, 1],
    chance: 300,
  },
  {
    perfect: 3,
    near: 4,
    bonuses: [0, 1],
    chance: 500,
  },
  {
    perfect: 4,
    near: 3,
    bonuses: [0, 3],
    chance: 200,
  },
  {
    perfect: 5,
    near: 2,
    bonuses: [0, 3],
    chance: 200,
  },
  {
    perfect: 6,
    near: 1,
    bonuses: [0, 2],
    chance: 100,
  },
  {
    perfect: 7,
    near: 0,
    bonuses: [0, 3],
    chance: 200,
  },
  {
    perfect: 0,
    near: 8,
    bonuses: [0, 3],
    chance: 100,
  },
  {
    perfect: 1,
    near: 7,
    bonuses: [0, 4],
    chance: 100,
  },
  {
    perfect: 2,
    near: 6,
    bonuses: [0, 5],
    chance: 200,
  },
  {
    perfect: 3,
    near: 5,
    bonuses: [0, 5],
    chance: 200,
  },
  {
    perfect: 4,
    near: 4,
    bonuses: [0, 5],
    chance: 200,
  },
  {
    perfect: 5,
    near: 3,
    bonuses: [0, 5],
    chance: 300,
  },
  {
    perfect: 6,
    near: 2,
    bonuses: [0, 5],
    chance: 200,
  },
  {
    perfect: 7,
    near: 1,
    bonuses: [0, 2],
    chance: 100,
  },
  {
    perfect: 8,
    near: 0,
    bonuses: [0, 3],
    chance: 100,
  },
  {
    perfect: 0,
    near: 9,
    bonuses: [0, 6],
    chance: 50,
  },
  {
    perfect: 1,
    near: 8,
    bonuses: [0, 4],
    chance: 100,
  },
  {
    perfect: 2,
    near: 7,
    bonuses: [0, 5],
    chance: 300,
  },
  {
    perfect: 3,
    near: 6,
    bonuses: [0, 5],
    chance: 300,
  },
  {
    perfect: 4,
    near: 5,
    bonuses: [0, 5],
    chance: 300,
  },
  {
    perfect: 5,
    near: 4,
    bonuses: [0, 5],
    chance: 400,
  },
  {
    perfect: 6,
    near: 3,
    bonuses: [0, 5],
    chance: 300,
  },
  {
    perfect: 7,
    near: 2,
    bonuses: [0, 5],
    chance: 200,
  },
];

const Bonus = (perfect, near) => {
  const preBonuses = [];
  const postBonuses = [];

  for (let i = 0; i < PN_Set.length; i++) {
    if (PN_Set[i].perfect === perfect && PN_Set[i].near === near) {
      const bonusChance = BonusChance(PN_Set[i]);

      if (bonusChance.bonus === BonusTypes.FREE_SPIN.index) {
        postBonuses.push(bonusChance);
      } else {          
        preBonuses.push(bonusChance);
      }

    }
  }

  return {
    preBonuses: preBonuses,
    postBonuses: postBonuses,
  };
};

export default Bonus;
