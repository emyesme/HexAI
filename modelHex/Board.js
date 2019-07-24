import { observable, action, computed, decorate } from 'mobx';
import random from 'lodash/random';
import Hex, { midpointRadius, sideLength } from './Hex';
import passedClickThreshold from '../utils/passedClickThreshold';

function generateGrid(board) {
    let size = board.length;
    const result = [];
    let counter = 0;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            result.push(new Hex(++counter, x + Math.floor(y / 2), y, board[y][x] * 1));
        }
    }
    return result;
}

export default class Board {
    constructor({ board, viewport }) {
        this.viewport = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        
        this.scale = 1;
        this.lastMouse = null;
        this.isDragging = false;
        this.didMove = false;
        this.cells = [];
        this.selected = null;

        this.gridSize = {x: board.length, y: board.length};
        this.cells = generateGrid(board);
        const { x, y } = this.cells[
            Math.floor(this.gridSize.x * this.gridSize.y / 2) + Math.floor(this.gridSize.y / 2)
        ].center;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.viewport = {
            x: this.screenBoundX(width / 2 - x, this.gridSize.x),
            y: this.screenBoundY(height / 2 - y, this.gridSize.y),
            width,
            height
        };
    }

    get gridWidth() {
        return this.cells[this.cells.length - 1].center.x + midpointRadius;
    }

    get gridHeight() {
        return this.cells[this.cells.length - 1].center.y + sideLength;
    }

    setSelected(cell) {
        this.selected = cell;
    }

    centerOnSelected() {
        if (this.selected) {
            const { x, y } = this.selected.center;
            this.viewport.x = this.screenBoundX(
                this.viewport.width / 2 - x,
                this.gridSize.x
            );
            this.viewport.y = this.screenBoundY(
                this.viewport.height / 2 - y,
                this.gridSize.y
            );
        }
    }

    screenBoundY(y, yOffset) {
        return Math.max(
            Math.min(0, y),
            this.viewport.height - (yOffset + 0.5) * 3 * sideLength / 2
        );
    };

    screenBoundX(x, xOffset) {
        return Math.max(
            Math.min(0, x),
            this.viewport.width - (xOffset + 0.5) * 2 * midpointRadius
        );
    };

    mouseDown(event) {
        this.isDragging = true;
        this.didMove = false;
        this.lastMouse = { x: event.screenX, y: event.screenY };
    }

    mouseUp(event) {
        this.isDragging = false;
    }

    mouseMove(event) {
        const { screenX, screenY } = event;
        if (
            this.isDragging &&
            (this.didMove || passedClickThreshold(this.lastMouse, event))
        ) {
            this.didMove = true;
            this.viewport.x = this.screenBoundX(
                this.viewport.x + screenX - this.lastMouse.x,
                this.gridSize.x
            );
            this.viewport.y = this.screenBoundY(
                this.viewport.y + screenY - this.lastMouse.y,
                this.gridSize.y
            );
            this.lastMouse = { x: screenX, y: screenY };
        }
    }
}

decorate(Board, {
    viewport: observable,
    gridSize: observable,
    scale: observable,
    lastMouse: observable,
    isDragging: observable,
    didMove: observable,
    cells: observable.shallow,
    selected: observable,
    gridWidth: computed,
    gridHeight: computed,
    setSelected: action.bound,
    centerOnSelected: action.bound,
    mouseDown: action.bound,
    mouseUp: action.bound,
    mouseMove: action.bound
});
