export interface ErrorResponse {
	message: string;
	details?: string[];
}

export interface FetchResponse<T> {
	data?: T;
	error?: ErrorResponse;
	hasError: boolean;
	status: number;
}

export async function get<Data>(url: string): Promise<FetchResponse<Data>> {
	const response = await fetch(url);

	if (!response.ok) {
		return {
			error: {
				message: response.statusText || "An error occurred",
			},
			hasError: true,
			status: response.status,
		};
	}

	const data = await response.json();
	return {
		data: data,
		hasError: false,
		status: response.status,
	};
}
