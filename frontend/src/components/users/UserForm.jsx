import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUser, createUser } from '@/store/userSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RoleSelect from './RoleSelect';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axiosInstance from '@/lib/axios';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, isLoading, error: userError } = useSelector((state) => state.users);
    const [error, setError] = useState('');

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
                password: ''
            });
        }
    }, [currentUser, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (!formData.role) {
                throw new Error('Role is required');
            }

            if (id) {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await dispatch(updateUser({ id, userData: updateData })).unwrap();
            } else {
                if (!formData.password) {
                    throw new Error('Password is required for new users');
                }
                
                const response = await axiosInstance.post('/users', formData);
                
                if (!response.data) {
                    throw new Error('Failed to create user');
                }
            }
            navigate('/users');
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Error:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{id ? 'Edit User' : 'Create User'}</CardTitle>
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label>Username</label>
                        <Input
                            value={formData.username}
                            onChange={(e) => setFormData((prev) => ({
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
                            onChange={(e) => setFormData((prev) => ({
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
                                onChange={(e) => setFormData((prev) => ({
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
                            onChange={(value) => setFormData((prev) => ({
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
