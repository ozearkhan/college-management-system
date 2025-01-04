// components/roles/RoleManagement.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Settings } from 'lucide-react';
import { fetchRoles, fetchRolePermissions } from '@/store/roleSlice';
import RolePermissionDialog from './RolePermissionDialog';

const RoleManagement = () => {
    const dispatch = useDispatch();
    const { roles, rolePermissions, isLoading } = useSelector(state => state.roles);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    useEffect(() => {
        if (roles.length > 0) {
            roles.forEach(role => {
                if (!rolePermissions[role.role]) {
                    dispatch(fetchRolePermissions(role.role));
                }
            });
        }
    }, [roles, dispatch, rolePermissions]);

    if (isLoading && roles.length === 0) {
        return <Skeleton className="w-full h-48" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Role Management</h1>
                <Button onClick={() => setSelectedRole({})}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roles && roles.map(role => (
                    <Card key={role.role || role.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {role.role || role.name}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRole(role)}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Permissions:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {rolePermissions[role.role || role.name] ? (
                                        rolePermissions[role.role || role.name].map(permission => (
                                            <Badge key={permission} variant="outline">
                                                {permission}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Skeleton className="h-6 w-20" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedRole && (
                <RolePermissionDialog
                    role={selectedRole}
                    open={!!selectedRole}
                    onClose={() => setSelectedRole(null)}
                    currentPermissions={rolePermissions[selectedRole.role || selectedRole.name] || []}
                />
            )}
        </div>
    );
};

export default RoleManagement;