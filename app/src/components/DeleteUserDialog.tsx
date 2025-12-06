import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/types/user";

interface DeleteUserDialogProps {
  open: boolean;
  user: User | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({
  open,
  user,
  isSubmitting,
  onClose,
  onConfirm,
}: DeleteUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o usuário{" "}
            <strong>{user?.name}</strong>? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSubmitting ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
