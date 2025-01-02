// components/layout/MainLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex min-h-screen flex-col">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header onMenuClick={toggleSidebar} />
            </div>
            
            <div className="flex pt-16"> {/* Add padding-top to account for fixed header */}
                {/* Sidebar */}
                <Sidebar 
                    open={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                    isMobile={isMobile}
                />
                
                {/* Main Content */}
                <div className={cn(
                    "flex-1 transition-all duration-300",
                    sidebarOpen ? "ml-64" : "ml-16"
                )}>
                    <main className="p-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
                        {/* Overlay for mobile when sidebar is open */}
                        {isMobile && sidebarOpen && (
                            <div 
                                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;