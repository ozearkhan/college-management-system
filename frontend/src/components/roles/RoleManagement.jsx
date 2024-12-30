// components/roles/RoleManagement.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, fetchRolePermissions } from '@/store/roleSlice';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const RoleManagement = () => {
    const dispatch = useDispatch();
    const { roles, rolePermissions, isLoading } = useSelector(state => state.roles);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    useEffect(() => {
        roles.forEach(role => {
            if (!rolePermissions[role.role]) {
                dispatch(fetchRolePermissions(role.role));
            }
        });
    }, [roles, dispatch, rolePermissions]);

    if (isLoading && roles.length === 0) {
        return <Skeleton className="w-full h-48" />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Role Management</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roles.map(role => (
                    <Card key={role.role}>
                        <CardHeader>
                            <CardTitle>{role.role}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Permissions:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {rolePermissions[role.role] ? (
                                        rolePermissions[role.role].map(permission => (
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
        </div>
    );
};

export default RoleManagement;