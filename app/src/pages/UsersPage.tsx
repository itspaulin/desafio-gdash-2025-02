import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, RefreshCw } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { UsersTable } from "@/components/UsersTable";
import { UserDialog } from "@/components/UserDialog";
import { DeleteUserDialog } from "@/components/DeleteUserDialog";
import { User } from "@/types/user";

export function UsersPage() {
  const {
    users,
    isLoading,
    isSubmitting,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      const success = await deleteUser(selectedUser.id);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const handleSubmit = async (data: any) => {
    if (selectedUser) {
      return await updateUser(selectedUser.id, data);
    } else {
      return await createUser(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">
            Administre os usuários do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleCreate}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            {users.length} {users.length === 1 ? "usuário" : "usuários"} no
            sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <UserDialog
        open={dialogOpen}
        user={selectedUser}
        isSubmitting={isSubmitting}
        onClose={() => {
          setDialogOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmit}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        user={selectedUser}
        isSubmitting={isSubmitting}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
