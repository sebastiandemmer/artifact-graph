import { Orb, NodeShapeType, OrbEventType, GraphObjectState, DefaultView } from '@memgraph/orb';
import  graph_data from '../data/graph_data.json';


export interface MyNode {
    id: string;
    label: string;
    }

export interface MyEdge {
        id: string;
        start: string;
        end: string;
        label: string
    }


function highlight_nodes(orb:Orb, nodes_list: Array<number>): void {
    nodes_list.forEach(node_id => {
        const node = orb.data.getNodeById(node_id)!;
        node.state = GraphObjectState.SELECTED
    });
}


export function redraw_graph(orb: Orb, nodes: Array<any>, edges: Array<any>): void {

    //remove all nodes
    var nodeIds = orb.data.getNodes().map(node => node.id);
    // No need to get edges because if we remove all the nodes, all the edges will be removed too
    orb.data.remove({ nodeIds: nodeIds });
    if (nodes.length == 0) {
        console.log("Length of nodes: "+nodes.length);
        orb.view.render();
        return
    }
    //add new nodes
    orb.data.merge({edges: edges, nodes: nodes});

    style_graph(orb);
    orb.view.render(() => {
        orb.view.recenter();
    });
    //set node mode to active
    nodeIds = orb.data.getNodes().map(node => node.id);

    highlight_nodes(orb, nodeIds);


}

export function style_graph(orb: Orb) : void {
    orb.setView(
        (context) => new DefaultView(context, {
            simulation: {
                isPhysicsEnabled: true
            }
        })
    )

    orb.data.setDefaultStyle({
        getNodeStyle(node) {
            const basicStyle = {
                borderColor: '#999999',
                color: '#DD2222',
                borderWidth: 0.3,
                // colorHover: '#e7644e',
                // colorSelected: '#e7644e',
                borderColorSelected: '#ffc107',
                borderWidthSelected: 0.6,
                borderColorHover: '#ffc107',
                borderWidthHover: 0.6,
                fontSize: 3,
                label: node.data.id,
                size: 6,
            };
    
            if (node.data.label === 'Event') {
                return {
                    ...basicStyle,
                    shape: NodeShapeType.CIRCLE,
                    size: 10,
                    color: '#AB47BC',
                };
            } else if (node.data.label === 'File') {
                return {
                    ...basicStyle,
                    shape:  NodeShapeType.SQUARE,
                    size: 10,
                    color: '#FF7043',
                };
            
            } else if (node.data.label === 'User') {
                return {
                    ...basicStyle,
                    shape:  NodeShapeType.DIAMOND,
                    size: 10,
                    color: '#26A69A',
                };
            } else if (node.data.label === 'Registry') {
                return {
                    ...basicStyle,
                    shape:  NodeShapeType.HEXAGON,
                    size: 10,
                    color: '#26A69A',
                };
            }
            return {
                ...basicStyle
            };
        },
        getEdgeStyle(edge) {
            return {
                color: '#999999',
                colorHover: '#1d1d1d',
                colorSelected: '#1d1d1d',
                fontSize: 3,
                width: 0.3,
                widthHover: 0.9,
                widthSelected: 0.9,
                label: edge.data.label,
            };
        },
    });
}

export function setup_controls(orb: Orb) : void {
    //add all neigbours
    const btn_all_neighbors = document.getElementById("all_neighbors_btn")!;
    btn_all_neighbors?.addEventListener('click', function handleClick() {
        console.log('button clicked');

        const original_nodes = orb.data.getNodes();
        
        orb.data.merge(graph_data);
        
        // const nodes = orb.data.getNodes();
        const new_nodes = new Array();
        const new_edges = new Array();
        new_nodes.push(original_nodes);
        original_nodes.forEach(node => {
            const node_full_graph = orb.data.getNodeById(node.id)!;
            new_nodes.push(node_full_graph.getAdjacentNodes());
            new_edges.push(node_full_graph.getEdges());
        });
        const new_nodes_data = new_nodes.flat().map(node => node.data);
        const new_edges_data = new_edges.flat().map(edge => edge.data);

        const nodeIds = orb.data.getNodes().map(node => node.id);
        // No need to get edges because if we remove all the nodes, all the edges will be removed too
        orb.data.remove({ nodeIds: nodeIds });
        style_graph(orb);
        console.log(new_edges);
        console.log(new_nodes.flat());

        orb.data.merge({edges: new_edges_data, nodes: new_nodes_data});
        orb.view.render(() => {
            orb.view.recenter();
        });
      });
    
    
    // 

    
}


export function create_graph() : Orb {
    const container = document.getElementById("graph")!;
    const graph_tooltip = document.getElementById('graph-tooltip')!;
    const graph_tooltip_header = document.getElementById('graph-tooltip-header')!;
    const graph_tooltip_body = document.getElementById('graph-tooltip-body')!;


    

    
    const orb = new Orb<MyNode, MyEdge>(container);

    //style graph
    
    style_graph(orb);

    // Initialize nodes and edges
    orb.data.setup(graph_data);

    // Render and recenter the view
    orb.view.render(() => {
        orb.view.recenter();
    });

    orb.events.on(OrbEventType.MOUSE_DOUBLE_CLICK, (event) => {
        if(typeof(event.subject) == "undefined") {
            graph_tooltip.hidden = true;       
        } else {
            console.log('Event: node-hover', event, event.subject.position);
            graph_tooltip.style.position = "relative";
            // console.log((event.subject.position as any).x);
            // console.log((event.subject.position as any).y);
            const node_center_x = event.globalPoint.x - (event.localPoint.x - (event.subject.position as any).x);
            const node_center_y = event.globalPoint.y - (event.localPoint.y - (event.subject.position as any).y);
        

            graph_tooltip.style.top = node_center_y + "px";
            graph_tooltip.style.left = node_center_x + "px";
            graph_tooltip.hidden = false;
            graph_tooltip_header.innerText = event.subject.data.label;
            const tooltip_html = getStringFromNode(event.subject.data);
            graph_tooltip_body.innerHTML = tooltip_html;
        }
        
    });

    orb.events.on(OrbEventType.NODE_CLICK, (event) => {
        if(typeof(event) == "undefined") {
            return
        } else {
            const canvas = document.getElementsByTagName("canvas")[0];
            const rect = canvas.getBoundingClientRect();
            graph_tooltip.style.top =  event.localPoint.y + canvas.height/2 + rect.top + "px";
            graph_tooltip.style.left = event.localPoint.x + canvas.width/2 + rect.left + "px";
        
            console.log(event.localPoint.x);
            console.log(event.node.position.x);
            console.log("X offset to node center: ", event.localPoint.x - event.node.position.x!);
        }
        
    });

    orb.events.on(OrbEventType.MOUSE_CLICK, (event) => {


        console.log(`Click event`, event);
    });
      
    
    const getStringFromNode = (node_data:any) => {
        const keys = Object.keys(node_data);
    
        let str = "";
        for (let i = 0; i < keys.length; i++) {
            str += `${keys[i]}: ${node_data[keys[i]]}<br>`;
        }
        return str;
    }

    return orb;
}


