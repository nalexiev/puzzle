import "./Tile.css";
import clsx from "clsx";

function Tile({ tile, ...props }) {
  const tileClasses = clsx(
    "tile animate__animated",
    { ["perfect  animate__pulse"]: tile.perfect },
    { ["near animate__pulse"]: tile.near },
    { ["animate__zoomOut"]: tile.collected }
  );

  return (
    <div
      data-index={tile.index}
      className={tileClasses}
    >
      <div className="inner" style={{ backgroundImage: `url(${tile.image})` }}>
        {tile.multiplierBonus !== 0 && props.showMultiplier && (
          <span className="multiplier animate__animated animate__zoomIn visible">X{tile.multiplierBonus}</span>
        )}
      </div>
    </div>
  );
}

export default Tile;
