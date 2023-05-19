import graph_data from '../data/graph_data.json';

export function get_all_edges() {
    return graph_data.edges
}

export function get_all_nodes() {
    return graph_data.nodes
}
export function get_neighbors(node_id: string) {
    //return all edges that start or end with the given node_id
    var all_neighbor_edges = graph_data.edges.filter(edge => edge.start == node_id || edge.end == node_id)
    const all_neighbor_edges_ids = new Set;
    all_neighbor_edges.forEach(edge => {
        all_neighbor_edges_ids.add(edge.start);
        all_neighbor_edges_ids.add(edge.end);
    });
    console.log(all_neighbor_edges_ids);
    var all_neighbor_nodes = graph_data.nodes.filter(node => all_neighbor_edges_ids.has(node.id))
    return [ all_neighbor_nodes, all_neighbor_edges];
}