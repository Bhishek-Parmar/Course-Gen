"use client";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "./CourseCard";
import { CourseList } from '@/configs/schema';
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import { HiOutlineBookOpen, HiOutlinePlus } from "react-icons/hi2";
import Link from "next/link";

const UserCourseList = () => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userCourseList, setUserCourseList } = useContext(UserCourseListContext);
  const { user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user]);

  const getUserCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await db.select()
        .from(CourseList)
        .where(eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(CourseList.id));
      
      setCourseList(result);
      setUserCourseList(result);
    } catch (err) {
      setError("Failed to fetch courses. Please try again.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="w-2/3 h-6 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-100 rounded animate-pulse"></div>
        <div className="w-5/6 h-4 bg-gray-100 rounded animate-pulse"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mt-10 space-y-6"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <motion.div variants={itemVariants} className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">My AI Courses</h2>
          <p className="text-gray-600">
            {courseList.length} course{courseList.length !== 1 ? 's' : ''} created
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Link
            href="/create-course"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white 
                     rounded-lg shadow-sm hover:bg-purple-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Create New Course
          </Link>
        </motion.div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <span className="text-red-600">⚠️</span>
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      ) : courseList.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {courseList.map((course, index) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <CourseCard
                  course={course}
                  refreshData={getUserCourses}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 px-4"
        >
          <div className="inline-block p-4 rounded-full bg-purple-100 mb-4">
            <HiOutlineBookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Courses Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first AI-powered course and start sharing your knowledge.
          </p>
          <Link
            href="/create-course"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white 
                     rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Create Your First Course
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserCourseList;