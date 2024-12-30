// components/layout/MainLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

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
        <div className="flex h-screen overflow-hidden">
            {/* Desktop sidebar */}
            {!isMobile && (
                <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
                    <Sidebar 
                        open={sidebarOpen} 
                        onClose={() => setSidebarOpen(false)} 
                        isMobile={isMobile}
                    />
                </div>
            )}
            
            {/* Mobile sidebar */}
            {isMobile && (
                <Sidebar 
                    open={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                    isMobile={isMobile}
                />
            )}
            
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header onMenuClick={toggleSidebar} />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
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
    );
};

export default MainLayout;