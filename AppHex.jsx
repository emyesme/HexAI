import React, { Component } from 'react';

import { observable, action, computed, decorate } from 'mobx';
import { observer } from 'mobx-react';
import { render } from 'react-dom';

import random from 'lodash/random';
import Hex, { midpointRadius, sideLength } from './modelHex/Hex';
import Board from './modelHex/Board';
import Map from './components/Map.jsx';

import passedClickThreshold from './utils/passedClickThreshold';

import problemContainer from './modelHex/problemContainer';
import {HexAgent, HexAgentRandom} from './modelHex/HexAgent';

problemContainer.addAgent("1", HexAgent, { play: true });
problemContainer.addAgent("2", HexAgentRandom, { play: false });

const App = observer(class App extends Component {
    constructor(props) {
        super(props);
        let gridSize = props.gridSize;
        let viewport = props.viewport;
        let map = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
        //let map = [[0,0,0,"2"],[0,0,"2",0],[0,"2",0,0],["1",0,0,"1"]] ;
        this.state = { board: new Board({ board: map }), status: "New game" };
        let that = this;

        this.iterator = problemContainer.interactiveSolve(map, {
            onFinish: (result) => {
                let board = JSON.parse(JSON.stringify(result.data.world));
                let actions = result.actions;
                that.setState({ board: new Board({ board }), status: 'Winner: ' + actions[actions.length - 1].agentID});
            },
            onTurn: (result) => {
                let board = JSON.parse(JSON.stringify(result.data.world));
                let actions = result.actions;
                that.setState({ board: new Board({ board }), status: 'Last move: ' + actions[actions.length - 1].agentID });
            }
        });
    }

    nextMove() {
        this.iterator.next();
    }

    render() {
        let appState = this.state;
        return (<div className="game">
            <div
                style={{
                    fontFamily: 'sans-serif',
                    textAlign: 'center',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'visible'
                }}>
                <Map app={appState.board} />
            </div>
            <div className="game-info">
                <div><button onClick={() => this.nextMove()}>Next</button></div>
            </div>
            <div className="status">{appState.status}</div>
        </div >);
    }
});

export default App;

decorate(App, {
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
