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

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/roles');
                if (!response.ok) throw new Error('Failed to fetch roles');
                const data = await response.json();
                setRoles(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching roles:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            dispatch(setCredentials(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <div>Loading roles...</div>;
    }

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
                                {roles.map(role => (
                                    <SelectItem key={role.role} value={role.role}>
                                        {role.role}
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
                    <Button type="submit" className="w-full">
                        Register
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