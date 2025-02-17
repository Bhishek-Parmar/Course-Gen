"use client";
import Image from 'next/image';
import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HiHome, 
    HiArrowLeft, 
    HiOutlineCog,
    HiOutlineQuestionMarkCircle,
    HiOutlineBell
} from "react-icons/hi2";
import { MdOutlineExplore } from "react-icons/md";
import { GrUpgrade } from "react-icons/gr";
import { TbLogout2 } from "react-icons/tb";
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { useUser } from "@clerk/nextjs";

const Tooltip = ({ children, content, visible }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50"
            >
                {content}
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </motion.div>
        )}
    </AnimatePresence>
);

const SideBar = () => {
    const { userCourseList } = useContext(UserCourseListContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [notifications, setNotifications] = useState(3); // Example notification count
    const { user } = useUser();
    const router = useRouter();
    const path = usePathname();

    // Check if mobile on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const Menu = [
        {
            id: 1,
            name: 'Home',
            icon: <HiHome className="w-6 h-6" />,
            path: '/dashboard',
        },
        {
            id: 2,
            name: 'Explore',
            icon: <MdOutlineExplore className="w-6 h-6" />,
            path: '/dashboard/explore',
        },
        {
            id: 3,
            name: 'Upgrade',
            icon: <GrUpgrade className="w-6 h-6" />,
            path: '/dashboard/upgrade',
            badge: 'PRO'
        },
        // {
        //     id: 4,
        //     name: 'Jobs',
        //     icon: <BsFillSuitcaseLgFill className="w-6 h-6" />,
        //     path: '/dashboard/jobs',
        //     badge: 'NEW'
        // }
    ];

    const bottomMenu = [
        {
            id: 'settings',
            name: 'Settings',
            icon: <HiOutlineCog className="w-6 h-6" />,
            path: '/dashboard/settings'
        },
        {
            id: 'help',
            name: 'Help & Support',
            icon: <HiOutlineQuestionMarkCircle className="w-6 h-6" />,
            path: '/dashboard/help'
        }
    ];

    const handleLogout = async () => {
        // Add your logout logic here
        router.push('/');
    };

    const sidebarVariants = {
        expanded: { width: "16rem" },
        collapsed: { width: "5rem" }
    };

    const mobileMenuVariants = {
        closed: {
            x: "-100%",
            transition: {
                when: "afterChildren"
            }
        },
        open: {
            x: 0,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const menuItemVariants = {
        closed: {
            x: -20,
            opacity: 0
        },
        open: {
            x: 0,
            opacity: 1
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <motion.button
                    className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
                    onClick={() => setIsOpen(!isOpen)}
                    whileTap={{ scale: 0.9 }}
                >
                    <HiArrowLeft 
                        className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </motion.button>
            )}

            {/* Sidebar */}
            <motion.div
                initial={isMobile ? "closed" : "expanded"}
                animate={isMobile ? (isOpen ? "open" : "closed") : (isCollapsed ? "collapsed" : "expanded")}
                variants={isMobile ? mobileMenuVariants : sidebarVariants}
                className={`fixed h-full bg-white shadow-lg z-40 overflow-hidden
                           ${isMobile ? 'top-0 left-0' : ''}`}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="p-5 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <motion.div
                            animate={{ opacity: isCollapsed && !isMobile ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image alt="logo" src="/logo.svg" width={160} height={100} />
                        </motion.div>
                        {!isMobile && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <motion.div
                                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                                >
                                    <HiArrowLeft className="w-5 h-5 text-gray-500" />
                                </motion.div>
                            </motion.button>
                        )}
                    </div>

                    {/* User Profile */}
                    <motion.div
                        variants={menuItemVariants}
                        className="mb-6 p-3 rounded-lg bg-gray-50"
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                src={user?.imageUrl || '/placeholder.jpg'}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            {(!isCollapsed || isMobile) && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {user?.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Notification Badge */}
                    <motion.div
                        variants={menuItemVariants}
                        className="mb-6"
                    >
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <HiOutlineBell className="w-6 h-6" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                            {notifications}
                                        </span>
                                    )}
                                </div>
                                {(!isCollapsed || isMobile) && (
                                    <span>Notifications</span>
                                )}
                            </div>
                        </button>
                    </motion.div>

                    {/* Main Menu */}
                    <nav className="flex-1">
                        <ul className="space-y-2">
                            {Menu.map((item) => (
                                <motion.li
                                    key={item.id}
                                    variants={menuItemVariants}
                                    onHoverStart={() => setHoveredItem(item.id)}
                                    onHoverEnd={() => setHoveredItem(null)}
                                >
                                    <Link href={item.path}>
                                        <motion.div
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                                                      ${item.path === path 
                                                        ? 'bg-purple-50 text-purple-600' 
                                                        : 'text-gray-600 hover:bg-gray-50'}`}
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="relative">
                                                {item.icon}
                                                {item.badge && (
                                                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {(!isCollapsed || isMobile) && (
                                                <span className="flex-1">{item.name}</span>
                                            )}

                                            {isCollapsed && !isMobile && (
                                                <Tooltip 
                                                    content={item.name}
                                                    visible={hoveredItem === item.id}
                                                />
                                            )}
                                        </motion.div>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-auto">
                        {/* Progress Section */}
                        {(!isCollapsed || isMobile) && (
                            <motion.div
                                variants={menuItemVariants}
                                className="mb-6 p-4 bg-purple-50 rounded-lg"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">Course Progress</span>
                                    <span className="text-xs text-purple-600 font-medium">
                                        {userCourseList?.length}/5
                                    </span>
                                </div>
                                <Progress 
                                    value={(userCourseList?.length / 5) * 100}
                                    className="h-2"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Upgrade for unlimited courses
                                </p>
                            </motion.div>
                        )}

                        {/* Bottom Menu */}
                        <ul className="space-y-2">
                            {bottomMenu.map((item) => (
                                <motion.li
                                    key={item.id}
                                    variants={menuItemVariants}
                                >
                                    <Link href={item.path}>
                                        <motion.div
                                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                                                     text-gray-600 hover:bg-gray-50"
                                            whileHover={{ x: 4 }}
                                        >
                                            {item.icon}
                                            {(!isCollapsed || isMobile) && (
                                                <span>{item.name}</span>
                                            )}
                                        </motion.div>
                                    </Link>
                                </motion.li>
                            ))}
                            
                            {/* Logout Button */}
                            <motion.li variants={menuItemVariants}>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer
                                             text-red-600 hover:bg-red-50"
                                >
                                    <TbLogout2 className="w-6 h-6" />
                                    {(!isCollapsed || isMobile) && (
                                        <span>Logout</span>
                                    )}
                                </button>
                            </motion.li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Backdrop */}
            {isMobile && (
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-30"
                        />
                    )}
                </AnimatePresence>
            )}
        </>
    );
};

export default SideBar;