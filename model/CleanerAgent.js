const Agent = require('ai-agents').Agent;

class CleanerAgent extends Agent {
    constructor(value) {
        super(value);
        this.table = {
            "0,0,0,0,0": "UP",
            "0,0,0,1,0": "UP",
            "0,0,1,0,0": "UP",
            "0,0,1,1,0": "LEFT",
            "0,1,0,0,0": "LEFT",
            "0,1,0,1,0": "RIGHT",
            "0,1,1,0,0": "LEFT",
            "0,1,1,1,0": "LEFT",
            "1,0,0,0,0": "UP",
            "1,0,0,1,0": "RIGHT", 
            "1,0,1,0,0": "DOWN",
            "1,0,1,1,0": "UP",
            "1,1,0,0,0": "RIGTH",
            "1,1,0,1,0": "RIGHT",
            "1,1,1,0,0": "DOWN",
            "default": "TAKE"
                    };
    }
    
    send() {
        let viewKey = this.perception.join();
        if(this.table[viewKey]) {
            return this.table[viewKey];
        } else {
            return this.table["default"];
        }
    }

}

module.exports = CleanerAgent;
