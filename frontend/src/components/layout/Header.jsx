// components/layout/Header.jsx
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { logout } from '@/store/authSlice';

const Header = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="ml-4 text-xl font-semibold">Student Management System</h1>
                </div>
                <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.username} ({user?.role})
          </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(logout())}
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;