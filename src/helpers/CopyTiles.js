const CopyTile = (tileToCopy) => {
    return {
        index: tileToCopy.index,
        image: "https://mystudio.bg/new/images/i" + (tileToCopy.index + 1) + ".png",
        perfect: tileToCopy.perfect,
        near: tileToCopy.near,
        collected: tileToCopy.collected,
        shuffled: tileToCopy.shuffled,
        multiplierBonus: tileToCopy.multiplierBonus ? tileToCopy.multiplierBonus : false,
    };
};

const CopyTiles = (tilesToCopy) => {
    const copiedTiles = [];

    for(let i = 0; i < tilesToCopy.length; i++) {
        copiedTiles.push(CopyTile(tilesToCopy[i]));
    }

    return copiedTiles;
};

const CreateNewTile = (tileIndex) => {
    return {
        index: tileIndex,
        image: "https://mystudio.bg/new/images/i" + (tileIndex + 1) + ".png",
        perfect: false,
        near: false,
        collected: false,
        shuffled: false,
        multiplierBonus: false,
    };
};

export { CopyTiles, CopyTile, CreateNewTile };