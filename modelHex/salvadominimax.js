    minimax(board) {
        var choice = [];
        //hace los hijos
        //dummy node

        let dummyNode = new Node(board, this.id, undefined, -9999);
        var dummyBoard = dummyNode.board.map(function (arr) { return arr.slice(); })
        //nivel 1        
        var moves = getEmptyHex(dummyBoard);
        let primerNivel = 1;
        let segundoNivel = 1;
        for (let move of moves) {
            var childboard = dummyBoard.map(function (arr) { return arr.slice(); });
            childboard[Math.floor(move / dummyBoard.length)][move % dummyBoard.length] = dummyNode.idAgent;//yo id
            //console.log("id nivel 1 ", dummyNode.idAgent)
            var betaOne = new Node(childboard, dummyNode.idAgent, dummyNode, 9999);//yo id
            if (primerNivel === 1) {
                console.log("primer nivel, primer hijo: ", move, "h: ", betaOne.heuristic);
            }
            primerNivel = primerNivel + 1;
            //betaOne.dijkstra()
            //console.log(betaOne);
            if (betaOne.treeDijkstra(dummyNode.idAgent) === 0) {
                return move
            }
            console.log("betaOne", betaOne.heuristic)
            //nivel 2
            let idOponent = "2";
            if (betaOne.idAgent !== "1") {
                idOponent = "1";
            }
            let betaOneBoard = betaOne.board.map(function (arr) { return arr.slice(); })
            let movesBeta = getEmptyHex(betaOneBoard);
            for (let moveBeta of movesBeta) {
                let childboardBetaOne = betaOneBoard.map(function (arr) { return arr.slice(); });
                //while nietos nunca actualizan al abuelo
                //console.log("id nivel 2 ", idOponent)
                childboardBetaOne[Math.floor(moveBeta / betaOneBoard.length)][moveBeta % betaOneBoard.length] = idOponent;
                let childNodeBetaOne = new Node(childboardBetaOne, idOponent, betaOne, -9999);//oponente
                if (segundoNivel === 1) {
                    console.log("segundo nivel, primer hijo: ", moveBeta, "h: ", childNodeBetaOne.heuristic);
                }
                segundoNivel = segundoNivel + 1;
                //nivel 3
                let movesChild = getEmptyHex(childboardBetaOne);
                for (let moveChild of movesChild) {
                    //console.log("id nivel 3 ", dummyNode.idAgent)
                    var babyboardAlphaOne = childboardBetaOne.map(function (arr) { return arr.slice(); });
                    babyboardAlphaOne[Math.floor(moveChild / childboardBetaOne.length)][moveChild % childboardBetaOne.length] = dummyNode.idAgent;
                    var babyNodeAlphaOne = new Node(babyboardAlphaOne, dummyNode.idAgent, childNodeBetaOne, 9999);//yo
                    //console.log("dijkstra babynodealphaone")
                    babyNodeAlphaOne.dijkstra();
                    console.log("tercer nivel, hijos: ", moveChild, "h: ", babyNodeAlphaOne.heuristic)
                    //movimiento propio no cambio heuristica
                    if (babyNodeAlphaOne.heuristic > childNodeBetaOne.heuristic) {
                        childNodeBetaOne.heuristic = babyNodeAlphaOne.heuristic;
                    }
                    if (babyNodeAlphaOne.heuristic >= betaOne.heuristic) {
                        //poda
                        break;
                    }
                }
                if (childNodeBetaOne.heuristic < betaOne.heuristic) {
                    betaOne.heuristic = childNodeBetaOne.heuristic;//////#############

                    //console.log("choice 3", choice, "heuristica, ", childNodeBetaOne.heuristic);
                }
                if (childNodeBetaOne.heuristic <= dummyNode.heuristic) {/////////////////////////
                    break;
                }
            }
            if (betaOne.heuristic > dummyNode.heuristic) {
                console.log("dummy antes", dummyNode.heuristic)
                dummyNode.heuristic = betaOne.heuristic;
                choice = move;
                console.log("choice", move, ":", dummyNode.heuristic)
                //console.log("choice", choice, "heuristica ,", betaOne.heuristic);
            }
        }
        return choice;
    }