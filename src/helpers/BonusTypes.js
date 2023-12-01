const BonusTypes = Object.freeze({
  NO_BONUS: {
    name: "There is not bonus. Preserve original game flow.",
    index: 0,
    shortName: 'No Bonus',
    classString: 'no-bonus'
  },
  FREE_SPIN: {
    name: "Make new spin, preserve dashboard but generate new template.",
    index: 1,
    shortName: 'Free spin',
    classString: 'free-spin'
  },
  MOVE_NEAR_TO_BECOME_PERFECT: {
    name: "Move Near tile to Perfect position",
    index: 2,
    shortName: 'Move near to perfect',
    classString: 'near-to-perfect'
  },
  SINGLE_TILE_SHUFFLE: {
    name: "Shuffle single non Perfect/Near tile",
    index: 3,
    shortName: 'Shuffle single tile',
    classString: 'single-tile-shuffle'
  },
  MOVE_PERFECT_TO_NEAR: {
    name: "Moves the Perfect tile into Near position.",
    index: 4,
    shortName: 'Move perfect to near',
    classString: 'perfect-to-near'
  },
  SWAP_NEAR_TILES: {
    name: "Swap Near tiles for a number of times for a chance to become Perfect tile",
    index: 5,
    shortName: 'Swap near tiles',
    classString: 'swap-near-tiles'
  },
  MAKE_ALL_NEAR_TO_PERFECT: {
    name: "Turn all Near tiles into Perfect tiles.",
    index: 6,
    shortName: 'Make all near to perfect',
    classString: 'all-near-to-perfect'
  },
});

export default BonusTypes;
