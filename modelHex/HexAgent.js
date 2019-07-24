const Agent = require('ai-agents').Agent;

class HexAgentRandom extends Agent {
    constructor(value) {
        super(value);
    }
    
    send() {
        let board = this.perception;
        let available = getEmptyHex(board);
        let move = available[Math.round(Math.random() * ( available.length -1 ))];
        return [Math.floor (move / board.length), move % board.length];
    }

}

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }
    
    send() {
        var board = this.perception;
        var cost = [];
        for(var i=0; i<board.length; i++) {
            cost[i] = new Array(board[0].length);
        }
        for (var j = 0; j < board.length; j++){
            for (var i = 0; i<board[0].length; i++){
                let neighboors = getNeighborhood(i * board.length + j, board);
                for (let neighboor of neighboors){
                    let row = Math.floor(neighboor / board.length);
                    let col = neighboor % board.length;
                    //el padre tiene una jugadad propia
                    if (board[i][j] === this.id ){
                        //si el vecino tiene jugada propia 
                            //costo es el mismo que llegar al padre

                        //si el vecino tiene jugada del oponente
                            //costo es infinito

                        //si el vecino NO tiene jugada
                            //costo es el del padre mas uno
                    }else{
                        //el padre tiene no tienen jugada
                        if (board[i][j] === 0){
                            //si el vecino tiene jugada propia
                                //costo es el costo del vecino

                            //si el vecino tiene jugada del oponente
                                //costo es infinito

                            //si el vecino NO tiene jugada
                                //costo es el del padre mas uno
                        }
                    }
                    //el padre tiene una jugada del oponente
                        //debe ignorar los vecinos
                }
            }
        }
        return [0,0];
    }
}

/**
 * Return an array of the neighbors of the currentHex
 * id = row * size + col
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Matrix} board 
 */
function getNeighborhood(currentHex, board) {
    let size = board.length;
    let row = Math.floor(currentHex / size);
    let col = currentHex % size;
    let result = [];
    if (row > 0) {
        result.push(col + (row - 1) * size);
    }
    if (row > 0 && col + 1 < size) {
        result.push(col + 1 + (row - 1) * size);
    }
    if (col > 0) {
        result.push(col - 1 + row * size);
    }
    if (col + 1 < size) {
        result.push(col + 1 + row * size);
    }
    if (row + 1 < size) {
        result.push(col + (row + 1) * size);
    }
    if (row + 1 < size && col > 0) {
        result.push(col - 1 + (row + 1) * size);
    }

    return result;
}

module.exports = {
    HexAgent,
    HexAgentRandom
};


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


class Node{
    constructor(state, parent){
        this.state = state;
        this.parent = parent;
        this.cost = heuristicScore()
    }
    heuristicScore(){
        //recibe el tablero y calcula el dijsktra para un jugador
        //recibe el tablero y calcula el dijsktra para el otro jugador
        //resta dependiendo de que jugador esta jugando
    }

}

class State {
    constructor(board, idAgent){
        this.board = board;
        this.idAgent = idAgent;
    }
        /**
     * genera los movimientos
     */
    possibleMoves(){
        //no tengo una posicion
        //el programa se encarga de ver si gane no es necesario
        //no necesita ser el mas corto eso se mira en el nodo
        //recibo las posiciones validas
        //voy a generar movimientos todos 
        //listo las posibles posiciones
        //con que criterio? solo debe ser valida
        //solo todas porque no hay obstaculos   
        let moves = getEmptyHex(this.board)
        return moves;
    }
}