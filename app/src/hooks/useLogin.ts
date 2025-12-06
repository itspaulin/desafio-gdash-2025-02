import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setToken } = useAuthStore();

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

    if (typeof responseData.message === "string") {
      return responseData.message;
    }

    if (typeof responseData.error === "string") {
      return responseData.error;
    }

    if (error.response?.status === 401) {
      return "Email ou senha incorretos";
    }

    if (error.response?.status === 429) {
      return "Muitas tentativas de login. Tente novamente mais tarde";
    }

    return "Erro ao fazer login. Tente novamente";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      setToken(response.data.accessToken);

      toast({
        title: "Login realizado!",
        description: `Bem-vindo(a), ${response.data.user.name}!`,
      });

      navigate("/");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      toast({
        variant: "destructive",
        title: "Erro no login",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
