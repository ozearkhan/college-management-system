// components/users/UserForm.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUser, createUser } from '@/store/userSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RoleSelect from './RoleSelect';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, isLoading, error } = useSelector((state) => state.users);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchUserById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (currentUser && id) {
            setFormData({
                username: currentUser.username,
                email: currentUser.email,
                role: currentUser.role,
                password: '' // Don't populate password for security
            });
        }
    }, [currentUser, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await dispatch(updateUser({ id, userData: formData }));
            } else {
                await dispatch(createUser(formData));
            }
            navigate('/users');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{id ? 'Edit User' : 'Create User'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label>Username</label>
                        <Input
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                username: e.target.value
                            }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label>Email</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                            required
                        />
                    </div>

                    {!id && (
                        <div className="space-y-2">
                            <label>Password</label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    password: e.target.value
                                }))}
                                required={!id}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label>Role</label>
                        <RoleSelect
                            value={formData.role}
                            onChange={(value) => setFormData(prev => ({
                                ...prev,
                                role: value
                            }))}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/users')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {id ? 'Update' : 'Create'} User
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default UserForm;