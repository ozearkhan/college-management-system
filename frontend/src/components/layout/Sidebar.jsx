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
            "h-[calc(100vh-4rem)] bg-white border-r fixed left-0 top-16",
            isMobile ? [
                "z-50 transform transition-all duration-200 ease-in-out",
                open ? "w-64" : "w-16"
            ] : [
                "transition-all duration-300",
                open ? "w-64" : "w-16"
            ]
        )}>
            <ScrollArea className="h-full">
                <nav className="px-3 py-2 space-y-1">
                    {menuItems.map(({ icon: Icon, label, path, permissions }) => (
                        permissions ? (
                            <PermissionGate key={path} requiredPermissions={permissions}>
                                <SidebarItem
                                    Icon={Icon}
                                    label={label}
                                    path={path}
                                    isActive={location.pathname === path}
                                    onClick={() => isMobile && onClose?.()}
                                    showLabel={open}
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
                                showLabel={open}
                            />
                        )
                    ))}
                </nav>

                {/* User Info Section */}
                <div className="absolute bottom-0 left-0 right-0 border-t p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        {open && (
                            <div>
                                <p className="text-sm font-medium">{user?.username}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
};

const SidebarItem = ({ Icon, label, path, isActive, onClick, showLabel }) => (
    <Link
        to={path}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
            isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900",
            !showLabel && "justify-center"
        )}
        title={!showLabel ? label : undefined}
    >
        <Icon className="h-4 w-4" />
        {showLabel && label}
    </Link>
);

export default Sidebar;