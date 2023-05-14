import { Orb } from '@memgraph/orb';
export interface MyNode {
    id: string;
    label: string;
}
export interface MyEdge {
    id: string;
    start: string;
    end: string;
    label: string;
}
export declare function redraw_graph(orb: Orb, nodes: Array<any>, edges: Array<any>): void;
export declare function style_graph(orb: Orb): void;
export declare function setup_controls(orb: Orb): void;
export declare function create_graph(): Orb;
