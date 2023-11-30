import Tile from "./Tile";
import "./Template.css";

function Template(props) {
  const x = props.x === 0 ? 0 : (100 / 6) * props.x;
  const y = props.y === 0 ? 0 : (100 / 6) * props.y;

  return (
    <div className="templateWrapper" style={{ left: x + "%", top: y + "%" }}>
      <div className="template">
        {props.tiles.map((tile, index) => {
          return <Tile showMultiplier={false} key={index} tile={tile} />;
        })}
      </div>
    </div>
  );
}

export default Template;
