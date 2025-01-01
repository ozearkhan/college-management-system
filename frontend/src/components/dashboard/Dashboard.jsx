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

// Main Dashboard Component
const Dashboard = () => {
    const dispatch = useDispatch();
    const { users, isLoading, error } = useSelector((state) => state.users);
    const { user } = useSelector((state) => state.auth);
    const { roles } = useSelector((state) => state.roles);

    useEffect(() => {
        if (user.role === 'ADMIN') {
            dispatch(fetchUsers());
            dispatch(fetchRoles());
        }
    }, [dispatch, user.role]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    switch (user.role) {
        case 'ADMIN':
            return <AdminDashboard users={users} roles={roles} />;
        case 'TEACHER':
            return <TeacherDashboard />;
        case 'STUDENT':
            return <StudentDashboard />;
        default:
            return <div>Access Denied</div>;
    }
};

// Admin Dashboard
const AdminDashboard = ({ users, roles }) => {
    // Role Distribution Data
    const roleDistribution = roles.map(role => ({
        name: role.role,
        count: users.filter(user => user.role === role.role).length,
    }));

    // Registration Trends Data (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const registrationTrends = last7Days.map(date => ({
        date,
        count: users.filter(user => user.created_at.split('T')[0] === date).length,
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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

// Teacher Dashboard
const TeacherDashboard = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>My Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>View and manage your classes here</p>
                </CardContent>
            </Card>
        </div>
    </div>
);

// Student Dashboard
const StudentDashboard = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>My Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>View your enrolled courses here</p>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default Dashboard;
