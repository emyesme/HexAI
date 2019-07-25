function minimax(parent_node, depth, max_player){
    //If the depth reach its limit or the node doesn't have any children return the node weight
    if(depth == 0 || !("children" in node)){
        return node.weight;
    }
    
    var bestValue, v;

    //
    if(max_player){
        bestValue = -Infinity;
    
        for(let child of parent_node){
            v = minimax(parent_node.children[child], depth-1, false);
            bestValue = Math.max(v, bestValue);
        }
    }else{
        bestValue = Infinity;
        for(let child of parent_node){
            v = minimax(parent_node.children[child], depth-1, true);
            bestValue = Math.min(v, bestValue);
        }

        return bestValue;
    }
}