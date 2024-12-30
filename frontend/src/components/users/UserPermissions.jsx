// components/users/UserPermissions.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '@/store/userSlice';
import { fetchRolePermissions } from '@/store/roleSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";

const UserPermissions = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.users);
    const { rolePermissions, isLoading } = useSelector((state) => state.roles);

    useEffect(() => {
        dispatch(fetchUserById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentUser?.role) {
            dispatch(fetchRolePermissions(currentUser.role));
        }
    }, [dispatch, currentUser?.role]);

    if (isLoading || !currentUser) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-6 w-20" />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const permissions = rolePermissions[currentUser.role] || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Permissions for {currentUser.username} ({currentUser.role})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((permission) => (
                                <Badge key={permission} variant="secondary">
                                    {permission}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No permissions found for this role.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UserPermissions;