"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Header from '@/app/_components/Header';
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList';
import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo';
import CourseDetails from '@/app/create-course/[courseId]/_components/CourseDetails';
import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineUserGroup } from 'react-icons/hi2';

function Course() {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();

    useEffect(() => {
        if (params.courseId) {
            GetCourse();
        }
    }, [params.courseId]);

    const GetCourse = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await db.select()
                .from(CourseList)
                .where(eq(CourseList.courseId, params.courseId));

            if (result?.[0]) {
                setCourse(result[0]);
            } else {
                setError("Course not found");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            setError("Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-48 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
                        <button
                            onClick={GetCourse}
                            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg 
                                     hover:bg-red-200 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Course Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <HiOutlineBookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Chapters</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {course?.courseOutput?.course?.chapters?.length || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <HiOutlineAcademicCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Level</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {course?.level}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <HiOutlineUserGroup className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {course?.category}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Course Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <CourseBasicInfo course={course} edit={false} />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <CourseDetails course={course} />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <ChapterList course={course} edit={false} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Course;