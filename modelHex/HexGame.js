
const Problem = require('ai-agents').Problem;

class HexGame extends Problem {

    constructor(args) {
        super(args);
        this.env = args;
    }

    /**
     * Check if the given solution solves the problem. You must override
     * @param {Object} solution 
     */
    goalTest(data) {
        let board = data.world;
        let size = board.length;
        for (let player of ['1', '2']) {
            for (let i = 0; i < size; i++) {
                let hex = -1;
                if (player === "1") {
                    if (board[i][0] === player) {
                        hex = i * size;
                    }
                } else if (player === "2") {
                    if (board[0][i] === player) {
                        hex = i;
                    }
                }
                if (hex >= 0) {
                    let row = Math.floor(hex / size);
                    let col = hex % size;
                    // setVisited(neighbor, player, board);
                    board[row][col] = -1;
                    let status = check(hex, player, board);
                    board[row][col] = player;
                    if (status) {
                        return true;
                    }
                }
            }
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
        let board = data.world;
        board[action[0]][action[1]] = agentID;
    }

    /**
     * Gives the world representation for the agent at the current stage
     * @param {*} agentID 
     * @returns and object with the information to be sent to the agent
     */
    perceptionForAgent(data, agentID) {
        return data.world;
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
        this.controller.setup({ world: world, problem: this });
        return this.controller.start(callbacks, true);
    }
}

module.exports = HexGame;

/**
 * Chech if there exist a path from the currentHex to the target side of the board
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Matrix} board 
 */
function check(currentHex, player, board) {
    if (isEndHex(currentHex, player, board.length)) {
        return true;
    }
    let neighbors = getNeighborhood(currentHex, player, board);
    for (let neighbor of neighbors) {
        let size = board.length;
        let row = Math.floor(neighbor / size);
        let col = neighbor % size;
        // setVisited(neighbor, player, board);
        board[row][col] = -1;
        let res =  check(neighbor, player, board);
        // resetVisited(neighbor, player, board);
        board[row][col] = player;
        if (res == true) {
            return true;
        }
    }
    return false;
}

/**
 * Return an array of the neighbors of the currentHex that belongs to the same player. The 
 * array contains the id of the hex. id = row * size + col
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Matrix} board 
 */
function getNeighborhood(currentHex, player, board) {
    let size = board.length;
    let row = Math.floor(currentHex / size);
    let col = currentHex % size;
    let result = [];
    if (row > 0 && board[row - 1][col] === player) {
        result.push(col + (row - 1) * size);
    }
    if (row > 0 && col + 1 < size && board[row - 1][col + 1] === player) {
        result.push(col + 1 + (row - 1) * size);
    }
    if (col > 0 && board[row][col - 1] === player) {
        result.push(col - 1 + row * size);
    }
    if (col + 1 < size && board[row][col + 1] === player) {
        result.push(col + 1 + row * size);
    }
    if (row + 1 < size && board[row + 1][col] === player) {
        result.push(col + (row + 1) * size);
    }
    if (row + 1 < size && col > 0 && board[row + 1][col - 1] === player) {
        result.push(col - 1 + (row + 1) * size);
    }

    return result;
}

/**
 * Chech if the current hex is a the opposite border of the board
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Number} size 
 */
function isEndHex(currentHex, player, size) {
    if (player === "1") {
        if ((currentHex + 1) % size === 0) {
            return true;
        }
    } else if (player === "2") {
        if (Math.floor(currentHex / size) === size - 1) {
            return true;
        }
    }
}

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board 
 */
function getEmptyHex(board) {
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === 0) {
                result.push(k * size + j);
            }
        }
    }
    return result;
}