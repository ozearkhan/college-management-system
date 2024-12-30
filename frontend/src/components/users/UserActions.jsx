// components/users/UserActions.jsx
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Key } from 'lucide-react';
import PermissionGate from '../auth/PermissionGate';

const UserActions = ({ user, onEdit, onDelete, onViewPermissions }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <PermissionGate requiredPermission="UPDATE_USER">
                    <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate requiredPermission="DELETE_USER">
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </PermissionGate>
                <DropdownMenuItem onClick={onViewPermissions}>
                    <Key className="mr-2 h-4 w-4" />
                    View Permissions
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserActions;