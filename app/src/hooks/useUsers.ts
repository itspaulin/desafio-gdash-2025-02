import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { userService } from "@/services/user.service";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: error.response?.data?.message || "Tente novamente mais tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    const responseData = error.response?.data;

    if (!responseData) {
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    }

    if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      const errorMessages = responseData.errors.map((err: any) => {
        if (typeof err === "string") return err;
        if (err.message) return err.message;
        return JSON.stringify(err);
      });
      return errorMessages.join(", ");
    }

    if (Array.isArray(responseData.message)) {
      return responseData.message.join(", ");
    }

    if (typeof responseData.message === "string" && responseData.message !== "Validation failed") {
      return responseData.message;
    }

    if (typeof responseData.error === "string" && responseData.error !== "Validation Error") {
      return responseData.error;
    }

    return "Erro ao processar requisição. Verifique os dados e tente novamente.";
  };

  const createUser = async (userData: CreateUserRequest) => {
    try {
      setIsSubmitting(true);
      const newUser = await userService.createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      toast({
        title: "Usuário criado!",
        description: `${newUser.name} foi adicionado com sucesso.`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (id: string, userData: UpdateUserRequest) => {
    try {
      setIsSubmitting(true);
      const updatedUser = await userService.updateUser(id, userData);
      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
      toast({
        title: "Usuário atualizado!",
        description: `${updatedUser.name} foi atualizado com sucesso.`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setIsSubmitting(true);
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast({
        title: "Usuário removido!",
        description: "O usuário foi removido com sucesso.",
      });
      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      toast({
        variant: "destructive",
        title: "Erro ao remover usuário",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    isLoading,
    isSubmitting,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
