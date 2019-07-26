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
        var t0 = performance.now();
        var board = this.perception.map(function (arr) { return arr.slice(); })
        //const board = this.perception;
        //console.log(this.perception)
        //console.log("costo del padre")
        //console.log(dummyNode)
        let depth = 3;
        let max_player = true;
        console.log("entra a minimax")
        let bestValue = this.minimax(board, depth, max_player);
        var t1 = performance.now();
        console.log("BESTVALUE", bestValue);
        console.log("tiempo ms",t1-t0);
        return [Math.floor(bestValue / board.length), bestValue % board.length];
    }

    minimax(board) {
        var choice = [];
        //hace los hijos
        //dummy node
        let dummyNode = new Node(board, this.id, undefined, -Infinity);
        var dummyBoard = dummyNode.board.map(function (arr) { return arr.slice(); })
        //nivel 1        
        var moves = getEmptyHex(dummyBoard);
        for (let move of moves) {
            var childboard = dummyBoard.map(function (arr) { return arr.slice(); });
            //console.log(childboard);
            childboard[Math.floor(move / dummyBoard.length)][move % dummyBoard.length] = dummyNode.idAgent;
            /*console.log("marco",dummyNode.idAgent)
            console.log(childboard[Math.floor(move / dummyBoard.length)][move % dummyBoard.length])
            console.log("chilboard cost..");
            console.log(childboard);*/
            var betaOne = new Node(childboard, dummyNode.idAgent, dummyNode, Infinity);
            //nivel 2
            let betaOneBoard = betaOne.board.map(function (arr) { return arr.slice(); })
            let movesBeta = getEmptyHex(betaOneBoard);
            for (let moveBeta of movesBeta) {
                let childboardBetaOne = betaOneBoard.map(function (arr) { return arr.slice(); });
                childboardBetaOne[Math.floor(moveBeta / betaOneBoard.length)][moveBeta % betaOneBoard.length] = betaOne.idAgent;
                let childNodeBetaOne = new Node(childboardBetaOne, betaOne.idAgent, betaOne, Infinity);
                //nivel 3
                //while nietos nunca actualizan al abuelo
            
/*                 for (let move of moves) {
                    var babyboardAlphaOne = childboardBetaOne.map(function (arr) { return arr.slice(); });
                    babyboardAlphaOne[Math.floor(move / childboardBetaOne.length)][move % childboardBetaOne.length] = childNodeBetaOne.idAgent;
                    var babyNodeAlphaOne = new Node(babyboardAlphaOne, childNodeBetaOne.idAgent, child, -Infinity);
                    console.log("dijkstra babynodealphaone")
                    babyNodeAlphaOne.dijkstra();
                    //movimiento propio no cambio heuristica
                    if (babyNodeAlphaOne.heuristic > childNodeBetaOne) {
                        childNodeBetaOne.heuristic = babyNodeAlphaOne.heuristic;
                    }
                    if (babyNodeAlphaOne.heuristic > betaOne.heuristic) {
                        //poda
                        break;

                    }/*else {
                        queueMinimax.push(babyNodeAlphaOne);
                    }*/

            //}
            /*
                console.log("reemplazo el valor del padre? 3", childNodeBetaOne.heuristic > childNodeBetaOne.heuristic)
                console.log(childNodeBetaOne.heuristic)
                console.log(babyNodeAlphaOne.heuristic)
                if (childNodeBetaOne.heuristic > childNodeBetaOne.parent.heuristic) {
                    childNodeBetaOne.heuristic = childNodeBetaOne.parent.heuristic;
                    choice = childNodeBetaOne.board;
                    console.log("choice 3", choice);
                }*/
                ////

                childNodeBetaOne.dijkstra();
                //console.log("dijkstra childnotebetaone", childNodeBetaOne)
                //movimientos del oponente
                childNodeBetaOne.heuristic = - childNodeBetaOne.heuristic;
                //
                /*console.log("nieto heuristica,", childNodeBetaOne.heuristic);
                console.log("nieto padre", betaOne.heuristic);
                console.log("nieto abuelo", dummyNode.heuristic);*/
                //poda
                if (childNodeBetaOne.heuristic < betaOne.heuristic) {
                    betaOne.heuristic = childNodeBetaOne.heuristic;
                }
                if (childNodeBetaOne.heuristic < dummyNode.heuristic) {/////////////////////////
                    break;
                }
                ////

            ///
            /*console.log("reemplazo el valor del padre?", betaOne.heuristic > dummyNode.heuristic)
            console.log(dummyNode.heuristic)
            console.log(betaOne.heuristic)*/
            if (betaOne.heuristic > dummyNode.heuristic) {
                dummyNode.heuristic = betaOne.heuristic;
                choice = move;
                console.log("choice", choice, "heuristica ,",betaOne.heuristic);
            }
            ///
            }
        }
            
        return choice;
    }

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


class Node {
    constructor(board, idAgent, parent, heuristic) {
        this.board = board;
        this.idAgent = idAgent;
        this.parent = parent;
        this.heuristic = heuristic;

        this.dijkstra = this.dijkstra.bind(this)
        this.treeDijkstra = this.treeDijkstra.bind(this)
        this.cost = this.cost.bind(this)
        this.insertSort = this.insertSort.bind(this)
        this.getNeighborhood = this.getNeighborhood.bind(this)

    }
    dijkstra() {
        if (this.parent === undefined) {
            this.heuristic = 0;
        }
        else {
            //contrincante id
            var idOponent = "2";
            if (this.idAgent !== "1") {
                idOponent = "1";
            }
            /*console.log(this.parent)*/
            let oponentCost = this.treeDijkstra(idOponent);/////////////////
            let myCost = this.treeDijkstra(this.idAgent);/////////////////
            /*console.log("sobrevivio")
            console.log("id", idOponent);
            console.log(isFinite(oponentCost));
            console.log("id", this.idAgent)
            console.log(myCost);
            console.log("estado ganador", isFinite(oponentCost));
            console.log("estado ganador", myCost)*/
            if (!isFinite(oponentCost)) {
                this.heuristic = myCost;
            }
            else {
                if (!isFinite(myCost)) {
                    this.heuristic = Infinity;
                }
                else {
                    this.heuristic = oponentCost - myCost; /////////////
                }
            }
            //console.log("estado ganador -", this.heuristic)
        }
        //console.log("TERMINA")
    }
    //
    treeDijkstra(id) {
        //console.log("empieza dijkstra", id === "1")
        //dummy node
        var queue = [];
        ///////////////////////////////////

        if (id === "1") {///////////////////////////////////////
            for (var i = 0; i < this.board[0].length; i++) {
                if (this.board[i][0] === id) {
                    let aux = new nodeDijkstra(i * this.board[0].length, 0, false)
                    this.insertSort(queue, aux);
                }
                else {
                    if (this.board[i][0] === 0) {
                        let coord = i * this.board[0].length;
                        let aux = new nodeDijkstra(coord, 1, false)
                        this.insertSort(queue, aux);
                    } else {
                        let aux = new nodeDijkstra(i * this.board[0].length, Infinity, false)
                        this.insertSort(queue, aux);
                    }
                }
            }
        } else {////////////////////////////////////////////////////////
            for (var i = 0; i < this.board.length; i++) {
                if (this.board[0][i] === id) {
                    let aux = new nodeDijkstra(0 * this.board[0].length + i, 0, false)
                    this.insertSort(queue, aux);
                }
                else {
                    if (this.board[0][i] === 0) {
                        let coord = 0 * this.board[0].length + i;
                        let aux = new nodeDijkstra(coord, 1, false)
                        this.insertSort(queue, aux);
                    } else {
                        let aux = new nodeDijkstra(0 * this.board[0].length + i, Infinity, false)
                        this.insertSort(queue, aux);
                    }
                }
            }
        }
        //////////////////////////////////////
        //console.log(queue)
        var stop = 0
        while (queue.length && stop < 500) {//3
            stop = stop + 1
            var currentNodeDijkstra = queue[0];
            queue.shift();
            if (currentNodeDijkstra === null) {
                return console.log("no solucion");
            }
            if (currentNodeDijkstra.goal) {
                //console.log("estado ganador", currentNodeDijkstra)
                var index = queue.findIndex(function (element) {
                    if (element !== null) {
                        return ((element.goal === currentNodeDijkstra.goal) && (element.weigth < currentNodeDijkstra.weigth));
                    }
                    return false;
                });
                if (index === -1) {
                    /*console.log("######################while ",stop)
                    console.log("META!!!!!!!!!!!!!!!!!!!!!!")    
                    console.log(currentNodeDijkstra)
                    console.log(queue);*/
                    return currentNodeDijkstra.weigth;
                } else {
                    /*console.log("######################while ",stop)
                    console.log("META!!!!!!!!!!!!!!!!!!!!!!En otra parte")    
                    console.log(queue[index])
                    console.log(queue);*/
                    return queue[index].weigth;
                }
                //llego

            }
            //console.log("calcula vecinos de nodedijkstra")
            let firstsChilds = this.getNeighborhood(currentNodeDijkstra, id)
            /*console.log("currentNodeDijkstra")
            console.log(currentNodeDijkstra)
            console.log("hijos obtenidos")
            console.log(firstsChilds)
            console.log("tiene vecinos de nodedijkstra")*/
            if (firstsChilds.length > 0) {
                //console.log("empieza a recorrer vecinos")
                for (let firstChild of firstsChilds) {
                    //verificaremos si el nodo existe en la lista
                    var index = queue.findIndex(function (element) {
                        if (element !== null) {
                            return element.coordinate === firstChild.coordinate;
                        }
                        return false;
                    });
                    if (index === -1) {
                        this.insertSort(queue, firstChild);
                    } else {
                        //console.log("existia")
                        //si existe y es meta ...
                        //console.log(queue.nodes[index].weigth , ">", firstChild.weigth)
                        //si existe y su costo es menor al del actual no cambia
                        if (queue[index].weigth > firstChild.weigth) {
                            //console.log("era mayor")
                            queue[index].weigth = firstChild.weigth
                        }
                    }
                }
                firstsChilds = []
                /*console.log("vacia la lista de vecinos generados")
                console.log(queue)*/
            }
        }
    };
    insertSort(array, element) {
        array.push(element);
        var i = array.length - 1;
        var item = array[i];
        while (i > 0 && item.weight < array[i - 1].weight) {
            array[i] = array[i - 1];
            i -= 1;
        }
        array[i] = item;
        return array;
    }
    /**Find the weigth between a node and other */
    cost(nodeFather, neighboorCoords, id) {
        /*console.log("cost")
        console.log("cost padre")
        console.log(nodeFather.coordinate)*/
        let size = this.board.length;
        let fatherRow = Math.floor(nodeFather.coordinate / size);
        let fatherCol = nodeFather.coordinate % size;
        let neighboorRow = Math.floor(neighboorCoords / size);
        let neighboorCol = neighboorCoords % size;
        if (this.board[fatherRow][fatherCol] === id) {
            //el padre tiene una jugada propia
            if (this.board[neighboorRow][neighboorCol] === 0) {
                //console.log("el vecino no tiene jugada pero padre si ")
                //si el vecino NO tiene jugada
                //costo vecino es el del padre mas uno
                return nodeFather.weigth + 1;
                //se reemplaza si tiene valor mejor al anterior
            } else {
                if (this.board[neighboorRow][neighboorCol] === id) {
                    //si el vecino tiene jugada propia 
                    //costo vecino es el mismo que llegar al padre
                    return nodeFather.weigth;
                    //se reemplaza si existe
                } else {
                    //si el vecino tiene jugada del oponente
                    //costo vecino es infinito
                    return Infinity;
                }
            }
        } else {
            if (this.board[fatherRow][fatherCol] === 0) {
                //el padre tiene no tienen jugada
                if (this.board[neighboorRow][neighboorCol] === 0) {
                    //console.log("vecino no tiene jugada y padre tampoco")
                    //si el vecino NO tiene jugada
                    //costo vecino es el del padre mas uno
                    return nodeFather.weigth + 1;
                    //se reemplaza si tiene un valor menor al que ya existe

                } else {
                    if (this.board[neighboorRow][neighboorCol] === id) {
                        //si el vecino tiene jugada propia
                        //costo vecino es el costo del padre
                        return nodeFather.weigth;
                        //y si ya existe se reemplaza


                    } else {
                        //si el vecino tiene jugada del oponente
                        //costo vecino es infinito
                        return Infinity;
                        //reemplazar el que exista si no es infinito
                    }
                }
            } else {
                //el padre tiene una jugada del oponente
                return Infinity
            }
        }

    };
    /**
     * Return an array of the neighbors of the currentHex
     * id = row * size + col
     * @param {Number} currentHex 
     * @param {Number} player 
     * @param {Matrix} board 
     */
    getNeighborhood(currentNodeDijkstra, id) {
        //console.log("obtener vecinos")
        let size = this.board.length;
        let row = Math.floor(currentNodeDijkstra.coordinate / size);
        let col = currentNodeDijkstra.coordinate % size;
        let result = [];
        if (row > 0) {
            //console.log("hijo1: ", col + (row - 1) * size)
            result.push(new nodeDijkstra(col + (row - 1) * size, this.cost(currentNodeDijkstra, col + (row - 1) * size, id), false));
        }
        if (row > 0 && col + 1 < size) {
            //console.log("hijo2: ", col + 1 + (row - 1) * size)
            result.push(new nodeDijkstra(col + 1 + (row - 1) * size, this.cost(currentNodeDijkstra, col + 1 + (row - 1) * size, id), false));
        }
        if (col > 0) {
            //console.log("hijo3: ", col - 1 + row * size)
            result.push(new nodeDijkstra(col - 1 + row * size, this.cost(currentNodeDijkstra, col - 1 + row * size, id), false));
        }
        if (col + 1 < size) {
            //console.log("hijo4: ",col + 1 + row * size)
            result.push(new nodeDijkstra(col + 1 + row * size, this.cost(currentNodeDijkstra, col + 1 + row * size, id), false));
        }
        if (row + 1 < size) {
            //console.log("hijo5: ", col + (row + 1) * size)
            result.push(new nodeDijkstra(col + (row + 1) * size, this.cost(currentNodeDijkstra, col + (row + 1) * size, id), false));
        }
        if (row + 1 < size && col > 0) {
            //console.log("hijo6: ", col - 1 + (row + 1) * size)
            result.push(new nodeDijkstra(col - 1 + (row + 1) * size, this.cost(currentNodeDijkstra, col - 1 + (row + 1) * size, id), false));
        }
        //////////////////////////////////
        if (id === "1") { ///////////////////////////////////////////////////
            if (col >= this.board[0].length - 1) {
                //console.log("hijo meta: ", col + row * size,"...",currentNodeDijkstra.weigth)
                //si el nodo que lleva a la meta es del oponente no cuenta como meta
                //si el nodo que lleva a la meta es infinity no cuenta
                if ((this.board[row][col] === 0 || this.board[row][col] === id) && isFinite(currentNodeDijkstra.weigth)) {
                    //console.log("meta creada ",new nodeDijkstra(col + 1 + row * size, currentNodeDijkstra.weigth, true))
                    result.push(new nodeDijkstra(col + row * size, currentNodeDijkstra.weigth, true));
                }
            }
        } else { //////////////////////////////////////////////////////////////////////////////////////////////////////
            if (row >= this.board.length - 1) {
                //console.log("hijo meta: ", col + row * size,"...",currentNodeDijkstra.weigth)
                //si el nodo que lleva a la meta es del oponente no cuenta como meta
                //si el nodo que lleva a la meta es infinity no cuenta
                if ((this.board[row][col] === 0 || this.board[row][col] === id) && isFinite(currentNodeDijkstra.weigth)) {
                    //console.log("meta creada ",new nodeDijkstra(col + 1 + row * size, currentNodeDijkstra.weigth, true))
                    result.push(new nodeDijkstra(col + row * size, currentNodeDijkstra.weigth, true));
                }
            }
        }
        /////////////////////////////////7
        return result;
    }
    ////

}

class nodeDijkstra {
    constructor(coordinate, weigth, goal) {
        this.coordinate = coordinate;
        this.weigth = weigth;
        this.goal = goal;
    }
}


