import Award from "./Award";
import Match from "./Match";
import MatchPosition from "./MatchPosition";

const BestMove = (dashboard, template, betSize, step, x = null, y = null) => {
  let maxScoreMove = null;

  //console.log(dashboard, template, betSize, step, x, y);

  if (x === null && y === null) {
    const dashboardPositions = Match(dashboard, template);

    let maxScore = 0;

    for (let i = 0; i < dashboardPositions.length; i++) {
      const { score, award, winnable, bonusable } = Award(
        dashboardPositions[i].perfect.length,
        dashboardPositions[i].near.length,
        betSize,
        step
      );

      if (score > maxScore && (award > 0 || bonusable)) {

        maxScoreMove = {
          x: dashboardPositions[i].x,
          y: dashboardPositions[i].y,
          award: award,
          score: score,
          winnable: winnable,
          perfect: dashboardPositions[i].perfect,
          near: dashboardPositions[i].near,
          template: template
        };

        maxScore = score;
      }
    }
  } else {
    const dashboardPositions = MatchPosition(
      [...dashboard],
      [...template],
      x,
      y
    );

    let perfectMatches = 0;
    let nearMatches = 0;

    const perfectMatchesArray = [];
    const nearMatchesArray = [];

    for (let i = 0; i < dashboardPositions.length; i++) {
      if (dashboardPositions[i].perfect) {
        perfectMatches++;
        perfectMatchesArray.push(dashboardPositions[i]);
      }
      if (dashboardPositions[i].near) {
        nearMatches++;
        nearMatchesArray.push(dashboardPositions[i]);
      }
    }

    const { score, award, winnable } = Award(
      perfectMatches,
      nearMatches,
      betSize,
      step
    );

    if (award > 0) {
      maxScoreMove = {
        x: x,
        y: y,
        award: award,
        score: score,
        winnable: winnable,
        perfect: perfectMatchesArray,
        near: nearMatchesArray,
      };
    }
  }

  return maxScoreMove;
};

export default BestMove;
