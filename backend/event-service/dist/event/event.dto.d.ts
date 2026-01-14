export interface Event {
    id?: string;
    user_id: string;
    event_type: string;
    event_data: any;
    timestamp?: string;
    processed?: boolean;
    created_at?: string;
}
