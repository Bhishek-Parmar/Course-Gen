// DropdownOption.jsx
"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";

function DropdownOption({ children, handleOnDelete }) {
    const [isOpen, setIsOpen] = useState(false);

    const menuVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0 }
    };

    return (
        <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)}>
                {children}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={menuVariants}
                            className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg 
                                     border border-gray-200 py-1 z-50"
                        >
                            <motion.button
                                whileHover={{ backgroundColor: '#F3F4F6' }}
                                className="w-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2"
                                onClick={() => {
                                    handleOnDelete();
                                    setIsOpen(false);
                                }}
                            >
                                <HiOutlineTrash className="w-4 h-4 text-red-500" />
                                Delete Course
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ backgroundColor: '#F3F4F6' }}
                                className="w-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2"
                            >
                                <HiOutlinePencil className="w-4 h-4 text-blue-500" />
                                Edit Course
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DropdownOption;