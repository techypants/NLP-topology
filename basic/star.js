class Node{
    constructor(id){
        this.id=id;
        this.connectedNodes = [];
    }
    connectTo(node){
        this.connectedNodes.push(node)
    }
    getConnectedNodes(){
        return this.connectedNodes;
    }
}

export default class StarTopology{
    constructor(numNodes){
        this.nodes=[];

        for(let i=0;i<numNodes;i++){
            this.nodes.push(new Node(i));
        }

        const hub = new Node('hub');

        this.nodes.forEach(node=>{
            node.connectTo(hub);
            hub.connectTo(node);
        });
    }

    getNode(id){
        return this.nodes[id]
    }
}

// const star = new StarTopology(5);

// const node0 = star.getNode('hub');

// console.log(star);

// module.exports=StarTopology
