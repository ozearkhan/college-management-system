// components/users/UserList.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser } from '@/store/userSlice';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Key, Trash } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import PermissionGate from '@/components/auth/PermissionGate';

const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, isLoading, error } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await dispatch(deleteUser(id));
            dispatch(fetchUsers()); // Refresh the list
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Users</h2>
                <PermissionGate requiredPermissions={['CREATE_USER']}>
                    <Button onClick={() => navigate('/users/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </PermissionGate>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <PermissionGate requiredPermissions={['UPDATE_USER']}>
                                            <DropdownMenuItem
                                                onClick={() => navigate(`/users/edit/${user.id}`)}
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                        </PermissionGate>
                                        <DropdownMenuItem
                                            onClick={() => navigate(`/users/${user.id}/permissions`)}
                                        >
                                            <Key className="h-4 w-4 mr-2" />
                                            Permissions
                                        </DropdownMenuItem>
                                        <PermissionGate requiredPermissions={['DELETE_USER']}>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </PermissionGate>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserList;