import { observable, computed, set, decorate } from "mobx";
import React from "react";

// sideLength is the length of one side of the hexagon
// is also the distance from the center to any point
export const sideLength = 30;
// midpointRadius is the distance from the center to midpoint of an edge side
export const midpointRadius = sideLength * 1.732 / 2;
// these are the offsets from the center for each vertex
const offsets = [
  [0, sideLength],
  [midpointRadius, sideLength / 2],
  [midpointRadius, -sideLength / 2],
  [0, -sideLength],
  [-midpointRadius, -sideLength / 2],
  [-midpointRadius, sideLength / 2]
];

export default class HexModel {
  /*id = "";
  x = null;
  y = null;
  type = 0;
  position = {};
  ref = React.createRef();*/

  constructor(id, x, y, type) {
    set(this, { id, x, y, type });
  }

  get fill() {
    switch (this.type) {
      case 0:
        return "white";
      case 1:
        return "red";
      case 2:
        return "black";
      case 3:
        return "orange";
      case 4:
        return "gray";
      default:
        return "white";
    }
  }

  get ident() {
    return `#${this.id} (${this.x},${this.y})`;
  }

  get isOnOddRow() {
    return this.y % 2 === 1;
  }

  get center() {
    return {
      x:
        midpointRadius +
        this.x * midpointRadius * 2 +
        (this.y % 2) * midpointRadius,
      y: sideLength + this.y * sideLength * 3 / 2
    };
  }

  get pathPoints() {
    return offsets.map(([offsetX, offsetY]) => [
      this.center.x + offsetX,
      this.center.y + offsetY
    ]);
  }

  isAdjacentTo(otherHex) {
    if (!otherHex || otherHex === this) return false;
    const diffX = this.x - otherHex.x;
    const diffY = this.y - otherHex.y;
    if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) return false;
    return (
      (this.isOnOddRow && diffX === -1) ||
      (!this.isOnOddRow && diffX === 1) ||
      Math.abs(diffX) + Math.abs(diffY) <= 1
    );
  };
}

decorate(HexModel, {
    id: observable,
    x: observable,
    y: observable,
    type: observable,
    position: observable,
    ref: observable.shallow,
    fill: computed,
    ident: computed,
    isOnOddRow: computed,
    center: computed,
    pathPoints: computed
  });

