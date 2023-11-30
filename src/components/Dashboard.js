import Tile from "./Tile";
import clsx from "clsx";

import "./Dashboard.css";

function Dashboard(props) {
  const dashboardClasses = clsx("dashboardWrapper animate__animated", {
    ["animate__zoomIn visible"]: props.visible
  });

  const styleProps = {
    x: '0',
    y: '0'
  };

  if (props.x !== undefined && props.y !== undefined) {
    styleProps.x = props.x === 0 ? 0 : 0 - (200 / 6) * props.x;
    styleProps.y = props.y === 0 ? 0 : 0 - (200 / 6) * props.y;
  }

  return (
    <div className={dashboardClasses}  style={{ left: styleProps.x + "%", top: styleProps.y + "%" }}>
      <div className="dashboard">
        {props.tiles.map((tile, index) => {
          return <Tile showMultiplier={true} key={index} tile={tile} />;
        })}
      </div>
      {props.children}
    </div>
  );
}

export default Dashboard;
