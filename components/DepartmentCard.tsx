import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Department } from "@/types/types";
import { User as UserIcon, Briefcase, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useDeleteMutation } from "@/hooks/api-client";
import { toast } from "sonner";

interface DepartmentCardProps {
  department: Department;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: () => void;
}

export function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = useDeleteMutation();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(`/departments/${department.id}`);
      toast.success("Department deleted successfully");
      if (onDelete) onDelete();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete department");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="relative group">
      <Link href={`/departments/${department.id}`}>
        <Card className="hover:border-primary transition-colors cursor-pointer h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {department.name}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mt-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Manager: </span>
                <span className="font-medium">
                  {department.manager ? (typeof department.manager === 'string' ? department.manager : `${department.manager.firstName} ${department.manager.lastName}`) : "Not Assigned"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      {onEdit && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={onEdit}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Department"
        description={`Are you sure you want to delete the "${department.name}" department? This action cannot be undone.`}
      />
    </div>
  );
}
