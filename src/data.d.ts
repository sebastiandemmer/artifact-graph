export declare function get_all_edges(): {
    id: string;
    start: string;
    label: string;
    end: string;
}[];
export declare function get_all_nodes(): ({
    id: string;
    label: string;
    file_path: string;
    tooltip?: undefined;
    event_id?: undefined;
    tooltop?: undefined;
    registry_path?: undefined;
} | {
    id: string;
    label: string;
    tooltip: string;
    file_path?: undefined;
    event_id?: undefined;
    tooltop?: undefined;
    registry_path?: undefined;
} | {
    id: string;
    label: string;
    tooltip: string;
    event_id: number;
    file_path?: undefined;
    tooltop?: undefined;
    registry_path?: undefined;
} | {
    id: string;
    label: string;
    tooltop: string;
    file_path?: undefined;
    tooltip?: undefined;
    event_id?: undefined;
    registry_path?: undefined;
} | {
    id: string;
    label: string;
    registry_path: string;
    tooltip: string;
    file_path?: undefined;
    event_id?: undefined;
    tooltop?: undefined;
})[];
