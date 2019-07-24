
const Problem = require('ai-agents').Problem;

class CleanerProblem extends Problem {
    
    constructor(args) {
        super(args);
        this.env = args;
    }

    /**
     * Check if the given solution solves the problem. You must override
     * @param {Object} solution 
     */
    goalTest(data) {
        let minX = min(data.world);
        if (data.interations >= this.env.maxIterations)
            return true;
        if (minX == 0) {
            return true;
        }
        return false;
    }

    /**
     * The transition model. Tells how to change the state (data) based on the given actions. You must override
     * @param {} data 
     * @param {*} action 
     * @param {*} agentID 
     */
    update(data, action, agentID) {
        let map = data.world;
        let agentState = data.states[agentID];
        if (action == "UP") {
            agentState.y -= 1;
        }
        if (action == "DOWN") {
            agentState.y += 1;
        }
        if (action == "LEFT") {
            agentState.x -= 1;
        }
        if (action == "RIGHT") {
            agentState.x += 1;
        }
        if (action == "TAKE") {
            map[agentState.y][agentState.x] = 0;
        }
        if (!data.interations) {
            data.interations = 1;
        } else {
            data.interations++;
        }
    }

    /**
     * Gives the world representation for the agent at the current stage
     * @param {*} agentID 
     * @returns and object with the information to be sent to the agent
     */
    perceptionForAgent(data, agentID) {
        let map = data.world;
        let agentState = data.states[agentID];
        let x = agentState.x;
        let y = agentState.y;
        let result = [];
        //LEFT
        result.push(x > 0 ? map[y][x - 1] : 1);
        //UP
        result.push(y > 0 ? map[y - 1][x] : 1);
        //RIGTH
        result.push(x < map[0].length - 1 ? map[y][x + 1] : 1);
        //DOWN
        result.push(y < map.length - 1 ? map[y + 1][x] : 1);
    
        result = result.map(value => value > 0 ? 1 : 0);
        //SMELL
    
        result.push(Math.abs(map[y][x]));
        return result;
    }

        /**
     * Solve the given problem
     * @param {*} world 
     * @param {*} callbacks 
     */
    solve(world, callbacks) {
        this.controller.setup({ world: world, problem: this });
        this.controller.start(callbacks, false);
    }

        /**
     * Returns an interable function that allow to execute the simulation step by step
     * @param {*} world 
     * @param {*} callbacks 
     */
    interactiveSolve(world, callbacks) {
        console.log("sdsdsdsds");
        this.controller.setup({ world: world, problem: this });
        return this.controller.start(callbacks, true);
    }
}

module.exports = CleanerProblem;


function min(data) {
    let min = 9999999;
    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] < min) {
                min = row[j];
            }
        }
    }
    return min;
}
