// components/users/RoleSelect.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles } from '@/store/roleSlice';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';

const RoleSelect = ({ value, onChange, className }) => {
    const dispatch = useDispatch();
    const { roles, isLoading } = useSelector(state => state.roles);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={isLoading}
            className={className}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
                {roles.map(role => (
                    <SelectItem key={role.role} value={role.role}>
                        {role.role}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default RoleSelect;