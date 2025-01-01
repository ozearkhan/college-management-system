// components/layout/Sidebar.jsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, 
    Users, 
    Settings,
    Shield,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { cn } from "@/lib/utils";
import PermissionGate from '@/components/auth/PermissionGate';

const Sidebar = ({ open, onClose, isMobile }) => {
    const { user } = useSelector(state => state.auth);
    const location = useLocation();

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/dashboard',
            // Everyone can see their dashboard
        },
        {
            icon: Users,
            label: 'Users',
            path: '/users',
            permissions: ['READ_USER']
        },
        {
            icon: Shield,
            label: 'Role Management',
            path: '/roles',
            permissions: ['CREATE_USER', 'UPDATE_USER', 'DELETE_USER']
        }
    ];

    return (
        <aside className={cn(
            "h-full bg-white border-r",
            isMobile ? [
                "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out",
                open ? "translate-x-0" : "-translate-x-full"
            ] : [
                "w-full transition-all duration-300",
                open ? "opacity-100" : "opacity-0 w-0"
            ]
        )}>
            <ScrollArea className="h-full">
                <div className="px-3 py-4">
                    <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
                        Student Management
                    </h2>
                    <nav className="space-y-1">
                        {menuItems.map(({ icon: Icon, label, path, permissions }) => (
                            permissions ? (
                                <PermissionGate key={path} requiredPermissions={permissions}>
                                    <SidebarItem
                                        Icon={Icon}
                                        label={label}
                                        path={path}
                                        isActive={location.pathname === path}
                                        onClick={() => isMobile && onClose?.()}
                                    />
                                </PermissionGate>
                            ) : (
                                <SidebarItem
                                    key={path}
                                    Icon={Icon}
                                    label={label}
                                    path={path}
                                    isActive={location.pathname === path}
                                    onClick={() => isMobile && onClose?.()}
                                />
                            )
                        ))}
                    </nav>
                </div>

                {/* User Info Section */}
                <div className="absolute bottom-0 left-0 right-0 border-t p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.username}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
};

const SidebarItem = ({ Icon, label, path, isActive, onClick }) => (
    <Link
        to={path}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
            isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
        )}
    >
        <Icon className="h-4 w-4" />
        {label}
    </Link>
);

export default Sidebar;