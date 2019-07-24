import React from "react";
import { line, curveLinearClosed } from "d3-shape";

import passedClickThreshold from "../utils/passedClickThreshold";

export default class GridCell extends React.Component {
  mouseDown(event) {
    this.didMove = false;
    this.lastMouse = { x: event.screenX, y: event.screenY };
  };
  mouseUp( event) {
    if (!this.didMove && this.lastMouse) this.props.onClick(this.props.cell);
    this.lastMouse = null;
  };
  mouseLeave() {
    this.didMove = true;
    this.lastMouse = null;
  };
  move(event) {
    if (this.lastMouse) {
      this.didMove =
        this.didMove || passedClickThreshold(this.lastMouse, event);
    }
  };
  render() {
    const { selected, cell } = this.props;
    return (
      <path
        onMouseDown={this.mouseDown}
        onMouseMove={this.move}
        onMouseUp={this.mouseUp}
        onMouseLeave={this.mouseLeave}
        d={line().curve(curveLinearClosed)(cell.pathPoints)}
        fill={cell.isAdjacentTo(selected) ? "yellow" : cell.fill}
        stroke={cell === selected ? "red" : "black"}
      />
    );
  }
}
