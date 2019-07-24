const problemContainer = require('./problemContainer');
const HextAgent = require('./HexAgent');

problemContainer.addAgent("1", HextAgent, {play: true});
problemContainer.addAgent("2", HextAgent, {play: false});

let map = [[0, '2', '1'],
            [0, '2', '2'],
            [0, '1', 0]];

this.state = { squares: map };
let that = this;
this.iterator = problemContainer.interactiveSolve(map, {
    onFinish: (result) => {
        let squares = JSON.parse(JSON.stringify(result.data.world));
           console.log("End of game: " + result.actions[result.actions.length - 1].agentID);
           console.log(result);
        },
        onTurn: (result) => {
            let squares = JSON.parse(JSON.stringify(result.data.world));
            console.log(squares);
        }
    });

this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
this.iterator.next();   
