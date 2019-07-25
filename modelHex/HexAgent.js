const Agent = require('ai-agents').Agent;

class HexAgentRandom extends Agent {
    constructor(value) {
        super(value);
    }

    send() {
        console.log(this)
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
        var board = this.perception;
        console.log(board)
        let node = new Node(new State(board,this.id), new State([],this.id));
        console.log(node.cost);
        let available = getEmptyHex(board);
        let move = available[Math.round(Math.random() * (available.length - 1))];
        return [Math.floor(move / board.length), move % board.length];
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
        console.log("treeDijkstra");
        this.cost = state.treeDijkstra();
        console.log("TERMINA")
    }
}

class nodeDijkstra {
    constructor(coordinate, weigth, goal) {
        this.coordinate = coordinate;
        this.weigth = weigth;
        this.goal = goal;
    }
}

class State {
    constructor(board, idAgent) {
        this.board = board;
        this.idAgent = idAgent;
    };
    treeDijkstra() {
        //dummy node
        //let nodeDijsktra = nodeDijsktra(-1, 0, false);
        var queue = [null]
        for (var i= 0; i< this.board[0].length; i++){
            if (this.board[i][0] === this.idAgent){
                let aux = new nodeDijkstra(i*this.board[0].length,0,false)
                this.insert(aux,queue)    
            }
            else{
                if(this.board[i][0] === 0){
                    console.log("hijovacio", i*this.board[0].length )
                    let coord = i*this.board[0].length;
                    let aux = new nodeDijkstra(coord,1,false)
                    this.insert(aux,queue)
                }else{
                    let aux = new nodeDijkstra(i*this.board[0].length,Infinity,false)
                    this.insert(aux,queue)    
                }
            }
        }
        console.log(queue)
        var taboo = [];
        var stop = 0
        while (queue.length && stop < 100){//3
            stop = stop + 1
            console.log("######################while ",stop)
            var currentNodeDijkstra = this.remove(queue);
            //taboo.push(currentNodeDijkstra);//evitar reemplazar por uno mas pesado
            console.log(currentNodeDijkstra);
            console.log("resto")
            console.log(queue)
            if(currentNodeDijkstra === null){
                return console.log("no solucion");
            }
            if( currentNodeDijkstra.goal){
                //llego
                console.log("META!!!!!!!!!!!!!!!!!!!!!!")    
                console.log(currentNodeDijkstra)
                return currentNodeDijkstra.weigth;
            }
            console.log("calcula vecinos de nodedijkstra")
            let firstsChilds = this.getNeighborhood(currentNodeDijkstra)
            console.log("currentNodeDijkstra")
            console.log(currentNodeDijkstra)
            console.log("hijos obtenidos")
            console.log(firstsChilds)
            console.log("tiene vecinos de nodedijkstra")
            if (firstsChilds.length > 0){
                console.log("empieza a recorrer vecinos")
                for (let firstChild of firstsChilds){
                    //verificaremos si el nodo existe en la lista
                    var index = queue.findIndex(function(element){
                    if (element !== null){
                        return element.coordinate === firstChild.coordinate;
                    }
                    return false;
                    });
                    if (index === -1){
                        this.insert(firstChild,queue);
                    }else{
                        console.log("existia")
                        //si existe y es meta ...
                        if(firstChild.goal){
                            console.log("meta comparando",queue[index].weigth,">",firstChild.weigth);
                        }
                        console.log(queue[index].weigth , ">", firstChild.weigth)
                        //si existe y su costo es menor al del actual no cambia
                        if(queue[index].weigth > firstChild.weigth){
                            console.log("era mayor")
                            queue[index].weigth = firstChild.weigth
                        }
                    }
                }
                firstsChilds = []   
                console.log("vacia la lista de vecinos generados")
                console.log(queue)
            }
        }
    };
    /**Find the weigth between a node and other */
    cost(nodeFather,neighboorCoords){
        console.log("cost")
        console.log("cost padre")
        console.log(nodeFather.coordinate)
        let size = this.board.length;
        let fatherRow = Math.floor(nodeFather.coordinate / size);
        let fatherCol = nodeFather.coordinate % size;
        let neighboorRow = Math.floor(neighboorCoords / size);
        let neighboorCol = neighboorCoords % size;
        if (this.board[fatherRow][fatherCol] === this.idAgent){
        //el padre tiene una jugada propia
            if(this.board[neighboorRow][neighboorCol] === 0){
                console.log("el vecino no tiene jugada pero padre si ")
            //si el vecino NO tiene jugada
                //costo vecino es el del padre mas uno
                return nodeFather.weigth + 1;
                //se reemplaza si tiene valor mejor al anterior
            }else{
                if(this.board[neighboorRow][neighboorCol] === this.idAgent){
                    //si el vecino tiene jugada propia 
                        //costo vecino es el mismo que llegar al padre
                        return nodeFather.weigth;
                        //se reemplaza si existe
                }else{
                //si el vecino tiene jugada del oponente
                    //costo vecino es infinito
                    return Infinity;
                }
            }
        }else{
            if(this.board[fatherRow][fatherCol] === 0){
            //el padre tiene no tienen jugada
                if(this.board[neighboorRow][neighboorCol] === 0){
                    //console.log("vecino no tiene jugada y padre tampoco")
                //si el vecino NO tiene jugada
                    //costo vecino es el del padre mas uno
                    return nodeFather.weigth + 1;
                    //se reemplaza si tiene un valor menor al que ya existe

                }else{
                    if(this.board[neighboorRow][neighboorCol] === this.idAgent){
                    //si el vecino tiene jugada propia
                        //costo vecino es el costo del padre
                        return nodeFather.weigth;
                        //y si ya existe se reemplaza
                        
                        
                    }else{
                    //si el vecino tiene jugada del oponente
                        //costo vecino es infinito
                        return Infinity;
                        //reemplazar el que exista si no es infinito
                    }
                }
            }else{
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
    getNeighborhood(currentNodeDijkstra) {
        console.log("obtener vecinos")
        let size = this.board.length;
        let row = Math.floor(currentNodeDijkstra.coordinate / size);
        let col = currentNodeDijkstra.coordinate % size;
        let result = [];
        if (row > 0) {
            console.log("hijo1: ", col + (row - 1) * size)
            result.push(new nodeDijkstra(col + (row - 1) * size,this.cost(currentNodeDijkstra,col + (row - 1) * size),false));
        }
        if (row > 0 && col + 1 < size) {
            console.log("hijo2: ", col + 1 + (row - 1) * size)
            result.push(new nodeDijkstra(col + 1 + (row - 1) * size, this.cost(currentNodeDijkstra,col + 1 + (row - 1) * size),false));
        }
        if (col > 0) {
            console.log("hijo3: ", col - 1 + row * size)
            result.push(new nodeDijkstra(col - 1 + row * size,this.cost(currentNodeDijkstra,col - 1 + row * size), false));
        }
        if (col + 1 < size) {
            console.log("hijo4: ",col + 1 + row * size)
            result.push(new nodeDijkstra(col + 1 + row * size,this.cost(currentNodeDijkstra,col + 1 + row * size),false));
        }
        if (row + 1 < size) {
            console.log("hijo5: ", col + (row + 1) * size)
            result.push(new nodeDijkstra(col + (row + 1) * size,this.cost(currentNodeDijkstra,col + (row + 1) * size),false));
        }
        if (row + 1 < size && col > 0) {
            console.log("hijo6: ", col - 1 + (row + 1) * size)
            result.push(new nodeDijkstra(col - 1 + (row + 1) * size,this.cost(currentNodeDijkstra,col - 1 + (row + 1) * size),false));
        }
        if(col >= this.board[0].length - 1){
            console.log("hijo meta: ", col + row * size,"...",currentNodeDijkstra.weigth)
            //si el nodo que lleva a la meta es del oponente no cuenta como meta
            //si el nodo que lleva a la meta es infinity no cuenta
            if ((this.board[row][col] === 0 || this.board[row][col] === this.idAgent) && isFinite(currentNodeDijkstra.weigth)){
                console.log("meta creada ",new nodeDijkstra(col + 1 + row * size, currentNodeDijkstra.weigth, true))
                result.push(new nodeDijkstra(col + row * size, currentNodeDijkstra.weigth, true));
            }
        }
        return result;
    }
    ////
	insert(num,heap) {
		heap.push(num);
		if (heap.length > 2) {
			let idx = heap.length - 1;
			while (heap[idx].weight < heap[Math.floor(idx/2)].weight) {
				if (idx >= 1) {
					[heap[Math.floor(idx/2)], heap[idx]] = [heap[idx], heap[Math.floor(idx/2)]];
					if (Math.floor(idx/2) > 1) {
						idx = Math.floor(idx/2);
					} else {
						break;
					};
				};
			};
		};
	};
    ////
	remove(heap) {
		let smallest = heap[1];
		if (heap.length > 2) {
			heap[1] = heap[heap.length - 1];
			heap.splice(heap.length - 1);
			if (heap.length == 3) {
				if (heap[1].weight > heap[2].weight) {
					[heap[1], heap[2]] = [heap[2], heap[1]];
				};
				return smallest;
			};
			let i = 1;
			let left = 2 * i;
			let right = 2 * i + 1;
			while (heap[i].weight >= heap[left].weight || heap[i].weight >= heap[right].weight) {
				if (heap[left].weight < heap[right].weight) {
					[heap[i], heap[left]] = [heap[left], heap[i]];
					i = 2 * i
				} else {
					[heap[i], heap[right]] = [heap[right], heap[i]];
					i = 2 * i + 1;
				};
				left = 2 * i;
				right = 2 * i + 1;
				if (heap[left] == undefined && heap[right] == undefined) {
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

