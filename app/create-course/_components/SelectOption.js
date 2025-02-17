// _components/SelectOption.jsx
"use client";
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { UserInputContext } from '../../_context/UserInputContext';
import { HiOutlineClock, HiOutlineAcademicCap, HiOutlineVideoCamera, HiOutlineBookOpen } from 'react-icons/hi2';

const SelectOption = () => {
    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

    const levels = [
        { id: 'beginner', name: 'Beginner', description: 'No prior knowledge required' },
        { id: 'intermediate', name: 'Intermediate', description: 'Basic understanding needed' },
        { id: 'advanced', name: 'Advanced', description: 'Deep knowledge required' }
    ];

    const durations = [
        { id: '1-2', name: '1-2 Hours', description: 'Quick and focused' },
        { id: '2-4', name: '2-4 Hours', description: 'Comprehensive coverage' },
        { id: '4-6', name: '4-6 Hours', description: 'In-depth exploration' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Course Configuration
                </h2>
                <p className="text-gray-600">
                    Set up the structure and requirements for your course
                </p>
            </motion.div>

            {/* Level Selection */}
            <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Course Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {levels.map((level) => (
                        <motion.div
                            key={level.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserCourseInput({
                                ...userCourseInput,
                                level: level.id
                            })}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${userCourseInput?.level === level.id
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-200'}`}
                        >
                            <HiOutlineAcademicCap className={`w-6 h-6 mb-2
                                ${userCourseInput?.level === level.id
                                    ? 'text-purple-600'
                                    : 'text-gray-400'}`}
                            />
                            <h3 className="font-medium text-gray-900">{level.name}</h3>
                            <p className="text-sm text-gray-500">{level.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Duration Selection */}
            <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Course Duration
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {durations.map((duration) => (
                        <motion.div
                            key={duration.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserCourseInput({
                                ...userCourseInput,
                                duration: duration.id
                            })}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${userCourseInput?.duration === duration.id
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-200'}`}
                        >
                            <HiOutlineClock className={`w-6 h-6 mb-2
                                ${userCourseInput?.duration === duration.id
                                    ? 'text-purple-600'
                                    : 'text-gray-400'}`}
                            />
                            <h3 className="font-medium text-gray-900">{duration.name}</h3>
                            <p className="text-sm text-gray-500">{duration.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Chapters Configuration */}
            <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Number of Chapters
                </label>
                <div className="flex items-center space-x-4">
                    <input
                        type="range"
                        min="3"
                        max="10"
                        value={userCourseInput?.noOfChapters || 5}
                        onChange={(e) => setUserCourseInput({
                            ...userCourseInput,
                            noOfChapters: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-medium text-purple-600 min-w-[3rem]">
                        {userCourseInput?.noOfChapters || 5}
                    </span>
                </div>
            </motion.div>

            {/* Video Option */}
            <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Include Video Content
                </label>
                <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userCourseInput?.displayVideo || false}
                            onChange={(e) => setUserCourseInput({
                                ...userCourseInput,
                                displayVideo: e.target.checked
                            })}
                            className="sr-only"
                        />
                        <div className={`relative w-14 h-7 transition-colors duration-200 ease-in-out rounded-full
                            ${userCourseInput?.displayVideo ? 'bg-purple-600' : 'bg-gray-200'}`}>
                            <div className={`absolute left-1 top-1 w-5 h-5 transition-transform duration-200 ease-in-out 
                                transform bg-white rounded-full
                                ${userCourseInput?.displayVideo ? 'translate-x-7' : 'translate-x-0'}`}
                            />
                        </div>
                        <span className="ml-3 text-sm text-gray-600">
                            {userCourseInput?.displayVideo ? 'Videos Enabled' : 'Videos Disabled'}
                        </span>
                    </label>
                </div>
            </motion.div>

            {/* Configuration Summary */}
            {(userCourseInput?.level || userCourseInput?.duration) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 rounded-lg p-6 mt-8"
                >
                    <h3 className="text-lg font-semibold text-purple-600 mb-4">
                        Course Configuration Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <HiOutlineAcademicCap className="w-6 h-6 text-purple-600 mb-2" />
                            <p className="text-sm text-gray-500">Level</p>
                            <p className="font-medium text-gray-900">{userCourseInput?.level || 'Not set'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <HiOutlineClock className="w-6 h-6 text-purple-600 mb-2" />
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium text-gray-900">{userCourseInput?.duration || 'Not set'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <HiOutlineBookOpen className="w-6 h-6 text-purple-600 mb-2" />
                            <p className="text-sm text-gray-500">Chapters</p>
                            <p className="font-medium text-gray-900">{userCourseInput?.noOfChapters || 'Not set'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <HiOutlineVideoCamera className="w-6 h-6 text-purple-600 mb-2" />
                            <p className="text-sm text-gray-500">Videos</p>
                            <p className="font-medium text-gray-900">{userCourseInput?.displayVideo ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SelectOption;