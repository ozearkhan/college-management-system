// components/auth/RegisterForm.jsx
import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {setCredentials} from "@/store/authSlice.js";
import axiosInstance from '@/lib/axios';
import { endpoints } from '@/config/api';

const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get(endpoints.roles.list);
                // Ensure we're setting an array of roles
                setRoles(response.data || []);
            } catch (err) {
                console.error('Error fetching roles:', err);
                setError('Failed to load roles. Please try again later.');
                setRoles([]); // Ensure roles is always an array
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post(endpoints.auth.register, formData);
            dispatch(setCredentials(response.data));
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData({...formData, role: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role"/>
                            </SelectTrigger>
                            <SelectContent>
                                {Array.isArray(roles) && roles.map(role => (
                                    <SelectItem 
                                        key={role.role || role} 
                                        value={role.role || role}
                                    >
                                        {role.role || role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
                <p className="text-sm text-center mt-4">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </CardContent>
        </Card>
    );
};

export default RegisterForm;