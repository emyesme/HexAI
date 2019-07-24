const Agent = require('ai-agents').Agent;

class HexAgentRandom extends Agent {
    constructor(value) {
        super(value);
    }

    send() {
        let board = this.perception;
        let available = getEmptyHex(board);
        let move = available[Math.round(Math.random() * (available.length - 1))];
        return [Math.floor(move / board.length), move % board.length];
    }

}

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }

    send() {
        return [0, 0];
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
    constructor(state, parent) {
        this.state = state;
        this.parent = parent;
        this.cost = state.dijsktra();
    }

}


class State {
    constructor(board, idAgent) {
        this.board = board;
        this.idAgent = idAgent;
    }
    treeDijsktra(board) {
        let nodeDijsktra = nodeDijsktra(-1, 0, false);
        let queue = [];
        for (let i= 0; i< board.length; i++){
            if (board[i][0] === this.idAgent){
                this.insert(nodeDijkstra(i*board.length+0,0,false),queue)    
            }
            else{
                if(board[i][0] === 0){
                    this.insert(nodeDijkstra(i*board.length+0,1,false),queue)    
                }else{
                    this.insert(nodeDijkstra(i*board.length+0,Infinity,false),queue)    
                }
            }
        }
        while (queue.length){
            currentNodeDijkstra = queue.remove();
            if(currentNodeDijkstra.goal){
                //llego
                return currentNodeDijkstra.weigth;
            }
            let firstsChilds = this.getNeighborhood(currentNodeDijkstra)
            if (firstsChilds.length > 0){
                for (let firstChild of firstsChilds){
                    this.insert(firstChild,queue);
                }
                firstsChilds = []
            }
        }
    }

    cost(nodeFather,neighboorCoords){
        //
        //el padre tiene una jugada propia
            //si el vecino tiene jugada propia 
                //costo vecino es el mismo que llegar al padre

            //si el vecino tiene jugada del oponente
                //costo vecino es infinito

            //si el vecino NO tiene jugada
                //costo vecino es el del padre mas uno

        //el padre tiene no tienen jugada
            //si el vecino tiene jugada propia
                //costo vecino es el costo del vecino

            //si el vecino tiene jugada del oponente
                //costo vecino es infinito

            //si el vecino NO tiene jugada
                //costo vecino es el del padre mas uno
        //el padre tiene una jugada del oponente
            //debe ignorar los vecinos
    }
    /**
     * Return an array of the neighbors of the currentHex
     * id = row * size + col
     * @param {Number} currentHex 
     * @param {Number} player 
     * @param {Matrix} board 
     */
    getNeighborhood(currentNodeDijkstra) {
        let metaCoordinate = this.board[0].length * this.board.length + this.board.length + 1
        let size = this.board.length;
        let row = Math.floor(this.currentNodeDijkstra.coordinate / size);
        let col = this.currentNodeDijkstra.coordinate % size;
        let result = [];
        if (row > 0) {
            result.push(nodeDijkstra(col + (row - 1) * size),cost(currentNodeDijkstra,col + (row - 1) * size),false);
        }
        if (row > 0 && col + 1 < size) {
            result.push(nodeDijsktra(col + 1 + (row - 1) * size, cost(currentNodeDijkstra,col + 1 + (row - 1) * size),false));
        }
        else{
            result.push(nodeDijsktra(metaCoordinate,currentNodeDijkstra.weigth, true));
        }
        if (col > 0) {
            result.push(nodeDijsktra(col - 1 + row * size,cost(currentNodeDijkstra,col - 1 + row * size), false));
        }
        if (col + 1 < size) {
            result.push(nodeDijsktra(col + 1 + row * size,cost(currentNodeDijkstra,col + 1 + row * size),false));
        }else{
            result.push(nodeDijsktra(metaCoordinate, currentNodeDijkstra.weigth, true));
        }
        if (row + 1 < size) {
            result.push(nodeDijsktra(col + (row + 1) * size,cost(currentNodeDijkstra,col + (row + 1) * size),false));
        }
        if (row + 1 < size && col > 0) {
            result.push(nodeDijsktra(col - 1 + (row + 1) * size,cost(currentNodeDijkstra,col - 1 + (row + 1) * size),false));
        }
        return result;
    }
    insert(node, heap){
        heap.push(node);
        if (heap.length > 2) {
            let idx = heap.length - 1;
            while (heap[idx].weigth < heap[Math.floor(idx / 2)].weigth) {
                if (idx >= 1) {
                    [heap[Math.floor(idx / 2)], heap[idx]] = [heap[idx], heap[Math.floor(idx / 2)]];
                    if (Math.floor(idx / 2) > 1) {
                        idx = Math.floor(idx / 2);
                    } else {
                        break;
                    };
                };
            };
        };
    }
	remove(heap){
		let smallest = heap[1].weigth;
		if (heap.length > 2) {
			heap[1] = heap[heap.length - 1];
			heap.splice(heap.length - 1);
			if (heap.length == 3) {
				if (heap[1].weigth > heap[2].weigth) {
					[heap[1], heap[2]] = [heap[2], heap[1]];
				};
				return smallest;
			};
			let i = 1;
			let left = 2 * i;
			let right = 2 * i + 1;
			while (heap[i].weigth >= heap[left].weigth || heap[i].weigth >= heap[right].weigth) {
				if (heap[left].weigth < heap[right].weigth) {
					[heap[i], heap[left]] = [heap[left], heap[i]];
					i = 2 * i
				} else {
					[heap[i], heap[right]] = [heap[right], heap[i]];
					i = 2 * i + 1;
				};
				left = 2 * i;
				right = 2 * i + 1;
				if (heap[left].weigth == undefined || heap[right].weigth == undefined) {
					break;
				};
			};
		} else if (heap.length == 2) {
			heap.splice(1, 1);
		} else {
			return null;
		};
		return smallest;
	};
}

class nodeDijsktra {
    constructor(coordinate, weigth, goal) {
        this.coordinate = coordinate;
        this.weigth = weigth;
        this.goal = goal;
    }
}