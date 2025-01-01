// components/dashboard/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/store/userSlice';
import { fetchRoles } from '@/store/roleSlice';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { users, isLoading, error } = useSelector((state) => state.users);
    const { user } = useSelector((state) => state.auth);
    const { roles } = useSelector(state => state.roles);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchRoles());
    }, [dispatch]);

    // Calculate role distribution
    const roleDistribution = roles.map(role => ({
        name: role.role,
        count: users.filter(user => user.role === role.role).length
    }));

    // Calculate user registration trends (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const registrationTrends = last7Days.map(date => ({
        date,
        count: users.filter(user =>
            user.created_at.split('T')[0] === date
        ).length
    }));
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <h1>debug</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{roles.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {users.filter(user =>
                                new Date(user.last_login).toDateString() === new Date().toDateString()
                            ).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Registration Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart width={500} height={300} data={registrationTrends}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Role Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart width={500} height={300} data={roleDistribution}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                        </LineChart>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;