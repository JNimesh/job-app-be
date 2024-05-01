import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpResponse<T> {
    data: T;
    status: number;
}

class HttpClient {
    private client: AxiosInstance;


    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:3000',
        });
    }

    private handleResponse(response: AxiosResponse) {
        return {
            data: response.data,
            status: response.status,
        };
    }

    private handleError(error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                data: error.response.data,
                status: error.response.status,
            };
        } else {
            throw error; // This will allow catching errors not related to network or Axios
        }
    }

    public async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        try {
            const response = await this.client.request({
                url,
                method,
                data,
                ...config,
            });
            return this.handleResponse(response) as HttpResponse<T>;
        } catch (error) {
            return this.handleError(error)  as HttpResponse<T>;
        }
    }
}

export default HttpClient;
