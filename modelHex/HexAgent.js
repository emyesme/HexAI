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
        //console.log(board)
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
        var queue = [];
        for (var i= 0; i< this.board[0].length; i++){
            if (this.board[i][0] === this.idAgent){
                let aux = new nodeDijkstra(i*this.board[0].length,0,false)
                this.insertSort(queue, aux);
            }
            else{
                if(this.board[i][0] === 0){
                    //console.log("hijovacio", i*this.board[0].length )
                    let coord = i*this.board[0].length;
                    let aux = new nodeDijkstra(coord,1,false)
                    this.insertSort(queue, aux);
                }else{
                    let aux = new nodeDijkstra(i*this.board[0].length,Infinity,false)
                    this.insertSort(queue, aux);
                }
            }
        }
        //console.log("primeros hijos")
        //console.log(queue)
        var stop = 0
        while (queue.length && stop < 500){//3
            stop = stop + 1
            //console.log("######################while ",stop)
            //console.log(queue);
            var currentNodeDijkstra = queue[0];
            queue.shift();

            //taboo.push(currentNodeDijkstra);//evitar reemplazar por uno mas pesado
            /*console.log(currentNodeDijkstra);
            console.log("resto")
            console.log(queue)*/
            if(currentNodeDijkstra === null){
                return console.log("no solucion");
            }
            if( currentNodeDijkstra.goal){
                //llego
                console.log("######################while ",stop)
                console.log("META!!!!!!!!!!!!!!!!!!!!!!")    
                console.log(currentNodeDijkstra)
                console.log(queue);
                return currentNodeDijkstra.weigth;
            }
            //console.log("calcula vecinos de nodedijkstra")
            let firstsChilds = this.getNeighborhood(currentNodeDijkstra)
            /*console.log("currentNodeDijkstra")
            console.log(currentNodeDijkstra)
            console.log("hijos obtenidos")
            console.log(firstsChilds)
            console.log("tiene vecinos de nodedijkstra")*/
            if (firstsChilds.length > 0){
                //console.log("empieza a recorrer vecinos")
                for (let firstChild of firstsChilds){
                    //verificaremos si el nodo existe en la lista
                    var index = queue.findIndex(function(element){
                    if (element !== null){
                        return element.coordinate === firstChild.coordinate;
                    }
                    return false;
                    });
                    if (index === -1){
                        this.insertSort(queue, firstChild);
                    }else{
                        //console.log("existia")
                        //si existe y es meta ...
                        //console.log(queue.nodes[index].weigth , ">", firstChild.weigth)
                        //si existe y su costo es menor al del actual no cambia
                        if(queue[index].weigth > firstChild.weigth){
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
    insertSort(array, element){
        array.push(element);
        var i = array.length - 1;
        var item = array[i];
        while (i > 0 && item.weight < array[i-1].weight) {
            array[i] = array[i-1];
            i -= 1;
        }
        array[i] = item;
        return array;
    }
    /**Find the weigth between a node and other */
    cost(nodeFather,neighboorCoords){
        /*console.log("cost")
        console.log("cost padre")
        console.log(nodeFather.coordinate)*/
        let size = this.board.length;
        let fatherRow = Math.floor(nodeFather.coordinate / size);
        let fatherCol = nodeFather.coordinate % size;
        let neighboorRow = Math.floor(neighboorCoords / size);
        let neighboorCol = neighboorCoords % size;
        if (this.board[fatherRow][fatherCol] === this.idAgent){
        //el padre tiene una jugada propia
            if(this.board[neighboorRow][neighboorCol] === 0){
                //console.log("el vecino no tiene jugada pero padre si ")
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
        //console.log("obtener vecinos")
        let size = this.board.length;
        let row = Math.floor(currentNodeDijkstra.coordinate / size);
        let col = currentNodeDijkstra.coordinate % size;
        let result = [];
        if (row > 0) {
            //console.log("hijo1: ", col + (row - 1) * size)
            result.push(new nodeDijkstra(col + (row - 1) * size,this.cost(currentNodeDijkstra,col + (row - 1) * size),false));
        }
        if (row > 0 && col + 1 < size) {
            //console.log("hijo2: ", col + 1 + (row - 1) * size)
            result.push(new nodeDijkstra(col + 1 + (row - 1) * size, this.cost(currentNodeDijkstra,col + 1 + (row - 1) * size),false));
        }
        if (col > 0) {
            //console.log("hijo3: ", col - 1 + row * size)
            result.push(new nodeDijkstra(col - 1 + row * size,this.cost(currentNodeDijkstra,col - 1 + row * size), false));
        }
        if (col + 1 < size) {
            //console.log("hijo4: ",col + 1 + row * size)
            result.push(new nodeDijkstra(col + 1 + row * size,this.cost(currentNodeDijkstra,col + 1 + row * size),false));
        }
        if (row + 1 < size) {
            //console.log("hijo5: ", col + (row + 1) * size)
            result.push(new nodeDijkstra(col + (row + 1) * size,this.cost(currentNodeDijkstra,col + (row + 1) * size),false));
        }
        if (row + 1 < size && col > 0) {
            //console.log("hijo6: ", col - 1 + (row + 1) * size)
            result.push(new nodeDijkstra(col - 1 + (row + 1) * size,this.cost(currentNodeDijkstra,col - 1 + (row + 1) * size),false));
        }
        if(col >= this.board[0].length - 1){
            //console.log("hijo meta: ", col + row * size,"...",currentNodeDijkstra.weigth)
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
}

const MinHeap = function() {
    this.nodes = [];
    this.getLeftIndex = (index) => 2 * index + 1;
    this.getRightIndex = (index) => 2 * index + 2;
    this.getParentIndex = (index) => {
      if (index === 0) return undefined;
      return Math.floor((index - 1) / 2);
    }
    this.insert = function(value) {
      this.nodes.push(value);
      let currentIndex = this.nodes.length - 1;
      let parentIndex = this.getParentIndex(currentIndex);
      while (parentIndex >= 0 && value.weight < this.nodes[parentIndex].weight) {
        // Swap the parent for the child.
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
        parentIndex = this.getParentIndex(currentIndex);
      }
    }
    this.remove = function() {
      if (this.nodes.length) {
        // Swap the first with the last node.
        this.swap(0, this.nodes.length - 1);		
        // Pop the min value.
        let minValue = this.nodes.pop();
        // Resort the array.
        this.siftDown(0);
        return minValue;
      }
    }
    this.siftDown = function(index) {
      let smallestIndex = index;
      let left = this.getLeftIndex(index);
      let right = this.getRightIndex(index);
      let size = this.nodes.length;
      if (left < size && this.nodes[left].weight < this.nodes[smallestIndex].weight) {
        smallestIndex = left;
      }
      if (right < size && this.nodes[right].weight < this.nodes[smallestIndex].weight) {
        smallestIndex = right;
      }
      if (index !== smallestIndex) {
        this.swap(smallestIndex, index);
        this.siftDown(smallestIndex);
      }
    }

    this.print = function() {
      return this.nodes;
    }
    this.swap = function(indexA, indexB) {
      let temp = this.nodes[indexA];
      this.nodes[indexA] = this.nodes[indexB];
      this.nodes[indexB] = temp;
    }
    this.sort = function() {
      let sorted = [];
      let heap = [...this.nodes];
      while (this.nodes.length) {
        sorted.push(this.remove());
      }
      this.nodes = heap;
      return sorted;
    }
  };


