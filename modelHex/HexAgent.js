/**
 * Introduccion a la Inteligencia Artificial
 * Integrantes:
 * Jaime Cuartas Granada 1632664
 * Emily Esmeralda Carvajal Camelo 1630436
 * Luis Restrepo Hoyos
 */

const Agent = require('ai-agents').Agent;

class HexAgentRandom extends Agent {
    constructor(value) {
        super(value);
        this.send = this.send.bind(this)
    }

    send() {
        //console.log(this)
        let board = this.perception;
        let available = getEmptyHex(board);
        let move = available[Math.round(Math.random() * (available.length - 1))];
        return [Math.floor(move / board.length), move % board.length];
    }

}

class HexAgent extends Agent {
    constructor(value) {
        super(value);
        this.minimax = this.minimax.bind(this)
        this.send = this.send.bind(this)
    };
    send() {
        //error raro 
        //var t0 = performance.now();
        var board = this.perception.map(function (arr) { return arr.slice(); })
        
        //const board = this.perception;
        //console.log(this.perception)
        //console.log("costo del padre")
        //console.log(dummyNode)
        let depth = 3;
        let max_player = true;
        //console.log("entra a minimax")
        let bestValue = this.minimax(board, depth, max_player);
        //var t1 = performance.now();
        //console.log("BESTVALUE", bestValue);
        //console.log("tiempo ms", t1 - t0);
        return [Math.floor(bestValue / board.length), bestValue % board.length];
    }
    /**minimax */
    minimax(board) {
        var choice = [];
        //hace los hijos
        //dummy node

        let dummyNode = new Node(board, this.id, undefined, -99);
        var dummyBoard = dummyNode.board.map(function (arr) { return arr.slice(); })
        //nivel 1        
        var moves = getEmptyHex(dummyBoard);
        let primerNivel = 1;
        for (let move of moves) {
            let childboard = dummyBoard.map(function (arr) { return arr.slice(); });
            childboard[Math.floor(move / dummyBoard.length)][move % dummyBoard.length] = dummyNode.idAgent;//yo id
            //console.log("id nivel 1 ", dummyNode.idAgent)
            let betaOne = new Node(childboard, dummyNode.idAgent, dummyNode, 99);//yo id
            //if (primerNivel === 1) {
                //console.log("primer nivel, hijo: ", move, "h: ", betaOne.heuristic);
            //}
            //betaOne.dijkstra()    
            //console.log(betaOne);
            if (betaOne.dijkstra(dummyNode.idAgent, childboard) === 0) {
                return move
            }
            //console.log("betaOne", betaOne.heuristic)
            //nivel 2
            let idOponent = "2";
            if (betaOne.idAgent !== "1") {
                idOponent = "1";
            }
            let movesBeta = getEmptyHex(childboard);
            for (let moveBeta of movesBeta) {
                let childboardBetaOne = betaOne.board.map(function (arr) { return arr.slice(); }); 
                //while nietos nunca actualizan al abuelo
                //console.log("id nivel 2 ", idOponent)
                childboardBetaOne[Math.floor(moveBeta / childboard.length)][moveBeta % childboard.length] = idOponent;
                let childNodeBetaOne = new Node(childboardBetaOne, idOponent, betaOne, -99);//oponente
                //if (primerNivel === 1){
                    //console.log("segundo nivel, hijo: child", move, "h: ", childNodeBetaOne.heuristic);
                //}
                //nivel 3
                let movesChild = getEmptyHex(childboardBetaOne);
                for (let moveChild of movesChild) {
                    //console.log("id nivel 3 ", dummyNode.idAgent)
                    var babyboardAlphaOne = childboardBetaOne.map(function (arr) { return arr.slice(); });
                    babyboardAlphaOne[Math.floor(moveChild / childboardBetaOne.length)][moveChild % childboardBetaOne.length] = dummyNode.idAgent;
                    var babyNodeAlphaOne = new Node(babyboardAlphaOne, dummyNode.idAgent, childNodeBetaOne, 99);//yo
                    //console.log("dijkstra babynodealphaone")
                    //nivel 4
                    let movesBaby = getEmptyHex(babyboardAlphaOne);
                    for (let moveBaby of movesBaby){
                        var smallBabyBoardBetaOne = babyboardAlphaOne.map(function (arr){ return arr.slice();});
                        smallBabyBoardBetaOne[Math.floor(moveBaby / babyboardAlphaOne.length)][moveBaby % babyboardAlphaOne.length] = idOponent;
                        let smallBabyBetaOne = new Node(smallBabyBoardBetaOne, idOponent, babyNodeAlphaOne, -99)//oponente
                        //nivel 5
                        let movesThing = getEmptyHex(smallBabyBoardBetaOne);
                        for(let moveThing of movesThing){
                            //console.log("quinto nivel")
                            var thingBoardAlphaOne = smallBabyBoardBetaOne.map(function (arr){ return arr.slice();});
                            thingBoardAlphaOne[Math.floor(moveThing / smallBabyBoardBetaOne.length)][moveThing % smallBabyBoardBetaOne.length] =dummyNode.idAgent;
                            let thingAlphaOne = new Node(thingBoardAlphaOne, dummyNode.idAgent, smallBabyBetaOne, 99);//yo
                            //heuristica de las hojas
                            thingAlphaOne.calculateHeuristic(thingAlphaOne.idAgent, thingAlphaOne.board);
                            //movimiento propio no cambio heuristica
                            if (thingAlphaOne.heuristic > smallBabyBetaOne.heuristic){
                                smallBabyBetaOne.heuristic = thingAlphaOne.heuristic;
                            }
                            //poda
                            if (thingAlphaOne.heuristic >= babyNodeAlphaOne.heuristic){
                                break;
                            }
                        }
                        if (smallBabyBetaOne.heuristic < babyNodeAlphaOne.heuristic) {
                            babyNodeAlphaOne.heuristic = smallBabyBetaOne.heuristic;//////#############
                        }
                        if (smallBabyBetaOne.heuristic <= babyNodeAlphaOne.heuristic) {/////////////////////////
                            break;
                        }

                    }
                    
                    //if (primerNivel === 1){
                        //console.log("tercer nivel, hijos: ", moveChild, "h: ", babyNodeAlphaOne.heuristic)
                    //}
                    //movimiento propio no cambio heuristica
                    if (babyNodeAlphaOne.heuristic > childNodeBetaOne.heuristic) {
                        childNodeBetaOne.heuristic = babyNodeAlphaOne.heuristic;
                    }
                    if (babyNodeAlphaOne.heuristic >= betaOne.heuristic) {
                        //poda
                        break;
                    }
                    
                }
                primerNivel = primerNivel + 1;
                if (childNodeBetaOne.heuristic < betaOne.heuristic) {
                    //console.log("aqui?",primerNivel,"...",childNodeBetaOne.heuristic, "<", betaOne.heuristic)
                    betaOne.heuristic = childNodeBetaOne.heuristic;//////#############
                    //console.log("beta one nuevo", betaOne.heuristic)
                    //console.log("choice 3", choice, "heuristica, ", childNodeBetaOne.heuristic);
                }
                if (childNodeBetaOne.heuristic <= dummyNode.heuristic) {/////////////////////////
                    break;
                }
            }
            //console.log("beta one move:",move, "heu", betaOne.heuristic)
            if (betaOne.heuristic > dummyNode.heuristic) {
                //console.log("dummy antes", dummyNode.heuristic)
                dummyNode.heuristic = betaOne.heuristic;
                choice = move;
                //console.log("choice", choice, ":", dummyNode.heuristic)
                //console.log("choice", choice, "heuristica ,", betaOne.heuristic);
            }
        }
        return choice;
    }
}


module.exports = {HexAgent, HexAgentRandom};

class Node {
    constructor(board, idAgent, parent, heuristic) {
        this.parent = parent;
        this.board = board
        this.idAgent = idAgent;
        this.heuristic = heuristic;
        /*
        this.heuristic = this.dijkstra.bind(this)
        this.dijkstra = this.dijkstra.bind(this)
        //this.treeDijkstra = this.treeDijkstra.bind(this)
        this.cost = this.cost.bind(this)
        //this.insertSort = this.insertSort.bind(this)
        this.getNeighborhood = this.getNeighborhood.bind(this)*/
    }

    calculateHeuristic(idIn, boardIn){
        let oponent = "1";
        if(idIn === "1"){
            oponent = "2";
        }
        //if (this.dijkstra(oponent))
        let heu = this.dijkstra(oponent, boardIn) - this.dijkstra(idIn, boardIn);
        //console.log("heu id:",idIn,"oponente: id:",oponent," ",this.dijkstra(oponent, boardIn)," propia:",this.dijkstra(idIn, boardIn));   
        this.heuristic = heu;
    }

    dijkstra(idIn, boardIn){
        let queueDijkstra = [];
        let size = boardIn.length;

        //A matrix of costs to save the min values found
        let costMatrix = new Array(size*size);
        costMatrix.fill(99);
        
        //A set to save the coordinates that i already check
        let visited = new Set();
        //A dictionary to asociate a symbol on board to the cost of arrive
        let initCosts={"1": 0, "2": 99, 0: 1}
        
        //Fill the first column if is '1'
        if(idIn === "1"){
            for(let i=0; i<size; i++){
                queueDijkstra.push(new nodeDijkstra(i*size, initCosts[boardIn[i][0]]));
                costMatrix[i*size]=initCosts[boardIn[i][0]];
                
            }
        }
        //Fill the first row if is '2'
        else{
            if(idIn === "2"){
                //If i want to check costs for idIn = '2' the symbol on board asociate to the cost is exchanged
                initCosts={"1": 99, "2": 0, 0: 1} 
                for(let i=0; i<size; i++){
                    queueDijkstra.push(new nodeDijkstra(i, initCosts[boardIn[0][i]]));
                    costMatrix[i]=initCosts[boardIn[0][i]];
                    
                }
            }
        }
        queueDijkstra.sort((a, b) => (a.weigth > b.weigth) ? 1 : -1);
        
        while(queueDijkstra.length){
            
            let currentNodeDijkstra = queueDijkstra.shift();
            
            //If we have visited this node has a min of the queue at some time, this cost is superior that that one
            //It is not necesary to check then
            if (visited.has(currentNodeDijkstra.coordinate)){
                continue;
            }
            visited.add(currentNodeDijkstra.coordinate);

            //check if is a win condiction depending on the player in
            if(idIn === "1"){
                if (((currentNodeDijkstra.coordinate + 1)% size) === 0){
                    
                    return currentNodeDijkstra.weigth;
                }
            }
            else{
                if(idIn=== "2"){
                    if(currentNodeDijkstra.coordinate >= ( size*size - size )){
                        return currentNodeDijkstra.weigth;
                    }
                }
            }
            //Get coordinates adyacent to a node. There are a list of numbers
            let childsCoordintes = this.getNeighborhoodCoordinate(currentNodeDijkstra, size)

            for (let childCoordinte of childsCoordintes){
                let rowChild = Math.floor(childCoordinte / size);
                let colChild = childCoordinte % size;
                //The cost of child is the weight of the current node plus the cost asociate to the symbol of board
                let costChild = currentNodeDijkstra.weigth + initCosts[boardIn[rowChild][colChild]];
                if( costChild < costMatrix[childCoordinte]){
                    costMatrix[childCoordinte] = costChild
                    queueDijkstra.push(new nodeDijkstra(childCoordinte, costChild));
                }
            }
            queueDijkstra.sort((a, b) => (a.weigth > b.weigth) ? 1 : -1);
        }
        return 99;
        
    }

    
    getNeighborhoodCoordinate(currentNodeDijkstraIn, size) {
        let actualCoordinate = currentNodeDijkstraIn.coordinate;
        let row = Math.floor(currentNodeDijkstraIn.coordinate / size);
        let col = currentNodeDijkstraIn.coordinate % size;
        let result = [];
        
        if (row > 0) {
            result.push(actualCoordinate-size);
        }
        if (row > 0 && col + 1 < size) {
            result.push(actualCoordinate-size+1);
        }
        if (col > 0) {
            result.push(actualCoordinate-1);
        }
        if (col + 1 < size) {
            result.push(actualCoordinate+1);
        }
        if (row + 1 < size && col > 0) {
            result.push(actualCoordinate+size-1);
        }
        if (row + 1 < size) {
            result.push(actualCoordinate+size);
        }
        return result;
    }

}

class nodeDijkstra {
    constructor(coordinate, weigth) {
        this.coordinate = coordinate;
        this.weigth = weigth;
        
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




