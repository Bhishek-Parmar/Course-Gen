"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBookOpen, HiMiniEllipsisVertical, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";
import DropdownOption from './DropdownOption';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

function CourseCard({ course, refreshData, displayUser = false }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOnDelete = async () => {
        try {
            setIsDeleting(true);
            const resp = await db.delete(CourseList)
                .where(eq(CourseList.id, course?.id))
                .returning({ id: CourseList?.id });
            
            if (resp) {
                refreshData();
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            className='relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
                     hover:shadow-md transition-all duration-300'
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={'/course/' + course?.courseId}>
                <div className="relative h-[200px] overflow-hidden">
                    <motion.div
                        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Image
                            alt={course?.courseOutput?.course?.name || "Course thumbnail"}
                            src={course?.courseBanner}
                            width={300}
                            height={200}
                            className='w-full h-full object-cover'
                        />
                    </motion.div>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Course level badge */}
                    <div className="absolute top-4 left-4">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full
                                     text-xs font-medium text-gray-900"
                        >
                            {course?.level}
                        </motion.div>
                    </div>
                </div>
            </Link>

            <div className='p-5 space-y-4'>
                {/* Course Title and Options */}
                <div className='flex justify-between items-start'>
                    <motion.h2
                        className='font-semibold text-lg text-gray-900 leading-tight'
                        initial={false}
                        animate={{ color: isHovered ? '#7C3AED' : '#111827' }}
                    >
                        {course?.courseOutput?.course?.name}
                    </motion.h2>
                    
                    {!displayUser && (
                        <DropdownOption handleOnDelete={handleOnDelete}>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                transition={{ duration: 0.2 }}
                                className="p-1 hover:bg-gray-100 rounded-full"
                                disabled={isDeleting}
                            >
                                <HiMiniEllipsisVertical className="w-5 h-5 text-gray-500" />
                            </motion.button>
                        </DropdownOption>
                    )}
                </div>

                {/* Category */}
                <p className='text-sm text-gray-500'>{course?.category}</p>

                {/* Course Stats */}
                <div className='flex items-center justify-between'>
                    <motion.div
                        className='flex items-center gap-2 px-3 py-1.5 bg-purple-50 
                                 text-purple-600 text-sm rounded-lg'
                        whileHover={{ scale: 1.05 }}
                    >
                        <HiOutlineBookOpen className="w-4 h-4" />
                        <span>{course?.courseOutput?.course?.numberOfChapters} Chapters</span>
                    </motion.div>
                </div>

                {/* Author Info */}
                {!displayUser && (
                    <motion.div
                        className='flex items-center gap-3 pt-4 border-t'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                                alt={course?.userName || "Author"}
                                src={course?.userProfileImage}
                                fill
                                className='object-cover'
                            />
                        </div>
                        <div>
                            <p className='text-sm font-medium text-gray-900'>
                                {course?.userName}
                            </p>
                            <p className='text-xs text-gray-500'>
                                Course Creator
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Delete Overlay */}
            <AnimatePresence>
                {isDeleting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm
                                 flex items-center justify-center"
                    >
                        <div className="text-white text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"
                            />
                            <p>Deleting...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default CourseCard;