import axios from "axios";

// Create Axios Instance
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor: Automatically inject JWT token into header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global error logging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API error:", error.response || error);
        return Promise.reject(error);
    }
);

// --- API Service Calls ---

export const authService = {
    async register(userData) {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },
    async login(credentials) {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },
    async getProfile() {
        const response = await api.get("/auth/profile");
        return response.data;
    }
};

export const courseService = {
    async getAll() {
        const response = await api.get("/courses");
        return response.data;
    },
    async getById(id) {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },
    async create(courseData) {
        const response = await api.post("/courses", courseData);
        return response.data;
    },
    async update(id, courseData) {
        const response = await api.put(`/courses/${id}`, courseData);
        return response.data;
    },
    async delete(id) {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },
    async enroll(id) {
        const response = await api.post(`/courses/${id}/enroll`);
        return response.data;
    },
    async getRoster(id) {
        const response = await api.get(`/courses/${id}/students`);
        return response.data;
    }
};

export const studentService = {
    async getAll() {
        const response = await api.get("/students");
        return response.data;
    },
    async getById(id) {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },
    async create(studentData) {
        const response = await api.post("/students", studentData);
        return response.data;
    },
    async update(id, studentData) {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data;
    },
    async delete(id) {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    }
};

export default api;
