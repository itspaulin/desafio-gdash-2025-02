import api from "./api";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user";

export const userService = {
  async getUsers() {
    const { data } = await api.get<{ data: User[] }>("/users");
    return data.data;
  },

  async getUserById(id: string) {
    const { data } = await api.get<{ data: User }>(`/users/${id}`);
    return data.data;
  },

  async createUser(userData: CreateUserRequest) {
    const { data } = await api.post<{ data: User }>("/users", userData);
    return data.data;
  },

  async updateUser(id: string, userData: UpdateUserRequest) {
    const { data } = await api.put<{ data: User }>(`/users/${id}`, userData);
    return data.data;
  },

  async deleteUser(id: string) {
    await api.delete(`/users/${id}`);
  },
};
