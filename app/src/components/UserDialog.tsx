import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user";

interface UserDialogProps {
  open: boolean;
  user?: User | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<boolean>;
}

export function UserDialog({
  open,
  user,
  isSubmitting,
  onClose,
  onSubmit,
}: UserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = user
      ? formData.password
        ? formData
        : { name: formData.name, email: formData.email, role: formData.role }
      : formData;

    const success = await onSubmit(submitData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {user ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {user
                ? "Atualize as informações do usuário"
                : "Preencha os dados para criar um novo usuário"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Senha {user && "(deixe em branco para manter)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!user}
                disabled={isSubmitting}
                placeholder={user ? "••••••" : ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "user") =>
                  setFormData({ ...formData, role: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : user ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
