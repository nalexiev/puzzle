const Award = (perfect, near, betSize, step) => {
  const PNFullSet = [
    [0, 0],
    [0, 1],
    [1, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [0, 3],
    [1, 2],
    [2, 1],
    [3, 0],
    [0, 4],
    [1, 3],
    [2, 2],
    [3, 1],
    [4, 0],
    [0, 5],
    [1, 4],
    [2, 3],
    [3, 2],
    [4, 1],
    [5, 0],
    [0, 6],
    [1, 5],
    [2, 4],
    [3, 3],
    [4, 2],
    [5, 1],
    [6, 0],
    [0, 7],
    [1, 6],
    [2, 5],
    [3, 4],
    [4, 3],
    [5, 2],
    [6, 1],
    [7, 0],
    [0, 8],
    [1, 7],
    [2, 6],
    [3, 5],
    [4, 4],
    [5, 3],
    [6, 2],
    [7, 1],
    [8, 0],
    [0, 9],
    [1, 8],
    [2, 7],
    [3, 6],
    [4, 5],
    [5, 4],
    [6, 3],
    [7, 2],
    [8, 1],
    // [9, 0],
    // [1, 2],
    // [2, 1],
    // [1, 3],
    // [3, 1],
    // [1, 4],
    // [4, 1],
    // [5, 0],
    // [1, 5],
    // [3, 3],
    // [4, 2],
    // [5, 1],
    // [6, 0],
    // [0, 7],
    // [1, 6],
    // [2, 5],
    // [3, 4],
    // [4, 3],
    // [5, 2],
    // [6, 1],
    // [7, 0],
    // [0, 8],
    // [1, 7],
    // [2, 6],
    // [3, 5],
    // [4, 4],
    // [5, 3],
    // [6, 2],
    // [7, 1],
    // [8, 0],
    // [0, 9],
    // [1, 8],
    // [2, 7],
    // [3, 6],
    // [4, 5],
    // [5, 4],
    // [6, 3],
    // [7, 2],
    // [8, 1],
  ];

  const PNSet = [
    [2, 0],
    [0, 3],
    [3, 0],
    [0, 4],
    [2, 2],
    [4, 0],
    [0, 5],
    [2, 3],
    [3, 2],
    [5, 0],
    [0, 6],
    [2, 4],
    [3, 3],
    [4, 2],
    [6, 0],
    [0, 7],
    [2, 5],
    [3, 4],
    [4, 3],
    [5, 2],
    [7, 0],
    [0, 8],
    [2, 6],
    [3, 5],
    [4, 4],
    [5, 3],
    [6, 2],
    [8, 0],
    [0, 9],
    [2, 7],
    [3, 6],
    [4, 5],
    [5, 4],
    [6, 3],
    [7, 2],
    [9, 0],
  ];


  const PN_BonusNotWinnable = [
    [1, 2],
    [2, 1],
    [1, 3],
    [3, 1],
    [1, 4],
    [4, 1],
    [1, 5],
    [5, 1],
    [1, 6],
    [6, 1],
    [1, 7],
    [7, 1],
    [1, 8]
  ];

  const perfectMatchWeight = 1.0;
  const nearMatchWeight = 0.7;
  const PNMinMultiplier = 0.2;
  const PNMaxMultiplier = 1;
  const globalPNumber = 119.0;
  const globalNNumber = 119.0;

  const perfectMatchesWeight = globalPNumber * perfectMatchWeight;
  const nearMatchesWeight = globalNNumber * nearMatchWeight;
  const PNTotalWeight = perfectMatchesWeight + nearMatchesWeight;
  const avgMultiplierStep = (PNMaxMultiplier - PNMinMultiplier) / PNTotalWeight;


  const isBonusable = (perfect, near) => {
    let isBonus = false;
    for(let i = 0; i < PN_BonusNotWinnable.length; i++) {
      if(perfect === PN_BonusNotWinnable[i][0] && near === PN_BonusNotWinnable[i][1]) {
        isBonus = true;
        break;
      }
    }
    return isBonus;
  }

  const getScore = (perfect, near, step) => {
    let score = 0;

    if (step === 1) {
      for (let i = 0; i < PNFullSet.length; i++) {
        if (PNFullSet[i][0] === perfect && PNFullSet[i][1] === near) {
          score = perfect * perfectMatchWeight + near * nearMatchWeight;
        }
      }
    }

    for (let i = 0; i < PNSet.length; i++) {
      if (PNSet[i][0] === perfect && PNSet[i][1] === near) {
        score = perfect * perfectMatchWeight + near * nearMatchWeight;
      }
    }

    return score;
  };

  const isCombinationWinnable = (perfect, near) => {
    let winnable = false;

    for (let i = 0; i < PNSet.length; i++) {
      if (PNSet[i][0] === perfect && PNSet[i][1] === near) {
        winnable = true;
        break;
      }
    }
    return winnable;
  };

  const getPNSum = (perfectMatches, nearMatches) => {
    const result = [0, 0];

    for (const item in PNSet) {
      result[0] += PNSet[item][0];
      result[1] += PNSet[item][1];

      if (PNSet[item][0] === perfectMatches && PNSet[item][1] === nearMatches) {
        break;
      }
    }

    return result;
  };

  const calculateMultiplier = (perfectMatches, nearMatches) => {
    const PNSum = getPNSum(perfectMatches, nearMatches);
    const perfectSum = PNSum[0];
    const nearSum = PNSum[1];

    const currentPMW = (perfectSum - 2) * perfectMatchWeight;
    const currentNMW = nearSum * nearMatchWeight;
    const currentMultiplier =
      (currentPMW + currentNMW) * avgMultiplierStep + PNMinMultiplier;

    return currentMultiplier;
  };

  const score = getScore(perfect, near, step);
  const multiplier = calculateMultiplier(perfect, near);
  const isWinnable = isCombinationWinnable(perfect, near);
  const isBonus = isBonusable(perfect, near);
  const award = !isWinnable && !isBonus ? 0 : betSize * (perfect + near) * multiplier;

  return {
    score: score,
    award: award,
    winnable: isWinnable,
    bonusable: isBonus
  };
};

export default Award;
