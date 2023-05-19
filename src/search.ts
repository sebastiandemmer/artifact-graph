import Fuse from 'fuse.js';
// import { INode } from "@memgraph/orb";
import {redraw_graph} from "./graph";
import {Orb} from "@memgraph/orb";
import {get_all_edges, get_all_nodes } from './data';


// export function setup_search_event(all_nodes: INode<any, any>[]) : void {
export function setup_search_event(orb: Orb) : void {
    const searchButton = document.getElementById('search-button')!;
    const searchInput = <HTMLInputElement>document.getElementById('search-input')!;

    const all_nodes = get_all_nodes();
    const all_edges = get_all_edges();

    const node_options = {
        includeScore: true,
        ignoreLocation: true,
        threshold: 0,
        keys: ['id','label','file_path']

    }

    const edge_options = {
        includeScore: true,
        ignoreLocation: true,
        threshold: 0,
        keys: ['id','label','file_path']

    }
    const fuse_nodes = new Fuse(all_nodes, node_options);
    const fuse_edges = new Fuse(all_edges, edge_options);

    searchButton.addEventListener('click', () => {
        execute_search();
    });

    // Execute a function when the user presses a key on the keyboard
    searchInput.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        searchButton.click();
        }
    });

    function execute_search() : void {
        const searchTerm = searchInput.value;

        if (searchTerm=="") {
            redraw_graph(orb, all_nodes, all_edges);
            return
        }
        const node_results = fuse_nodes.search(searchTerm);
        const edge_results = fuse_edges.search(searchTerm);
        const results_nodes = node_results.map(result => result.item);
        const results_edges = edge_results.map(result => result.item);
        console.log(results_edges,results_nodes);
        
        redraw_graph(orb, results_nodes, results_edges);
    }
}