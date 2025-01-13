import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { assignPermissions } from '@/store/roleSlice';
import { fetchRoles } from '@/store/roleSlice';
import { fetchRolePermissions } from '@/store/roleSlice';

const AVAILABLE_PERMISSIONS = [
    'CREATE_USER',
    'READ_USER',
    'UPDATE_USER',
    'DELETE_USER',
    'MANAGE_COURSES'
];

const RolePermissionDialog = ({ role, open, onClose, currentPermissions = [] }) => {
    const dispatch = useDispatch();
    const [selectedPermissions, setSelectedPermissions] = useState(currentPermissions);

    useEffect(() => {
        setSelectedPermissions(currentPermissions);
    }, [currentPermissions]);

    const handleSubmit = async () => {
        try {
            await dispatch(assignPermissions({
                roleId: role.id,
                permissions: selectedPermissions
            })).unwrap();
            
            dispatch(fetchRoles());
            dispatch(fetchRolePermissions(role.name));
            onClose();
        } catch (error) {
            console.error('Failed to update permissions:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Permissions for {role.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {AVAILABLE_PERMISSIONS.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                                id={`permission-${permission}`}
                                checked={selectedPermissions.includes(permission)}
                                onCheckedChange={(checked) => {
                                    setSelectedPermissions(prev =>
                                        checked
                                            ? [...prev, permission]
                                            : prev.filter(p => p !== permission)
                                    );
                                }}
                            />
                            <label 
                                htmlFor={`permission-${permission}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {permission}
                            </label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RolePermissionDialog; 