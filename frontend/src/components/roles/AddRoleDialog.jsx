import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRole } from '@/store/roleSlice';

const AddRoleDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        try {
            await dispatch(createRole({
                name: roleName.toUpperCase(),
                description
            })).unwrap();
            
            dispatch(fetchRoles());
            onClose();
        } catch (error) {
            console.error('Failed to create role:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="roleName">Role Name</label>
                        <Input
                            id="roleName"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Enter role name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description">Description</label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter role description"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!roleName}>
                        Create Role
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRoleDialog; 