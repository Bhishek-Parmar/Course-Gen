// _components/TopicDescription.jsx
"use client";
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { UserInputContext } from '../../_context/UserInputContext';

const TopicDescription = () => {
    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
    const [charCount, setCharCount] = useState(0);

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

    const handleTopicChange = (e) => {
        setUserCourseInput({
            ...userCourseInput,
            topic: e.target.value
        });
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        setCharCount(text.length);
        setUserCourseInput({
            ...userCourseInput,
            description: text
        });
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
                    Define Your Course Topic
                </h2>
                <p className="text-gray-600">
                    Provide a clear title and description for your course
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Course Title
                    </label>
                    <input
                        type="text"
                        value={userCourseInput?.topic || ''}
                        onChange={handleTopicChange}
                        placeholder="e.g., Advanced React Development with Next.js"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                 focus:ring-2 focus:ring-purple-600 focus:border-transparent
                                 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Course Description
                    </label>
                    <textarea
                        value={userCourseInput?.description || ''}
                        onChange={handleDescriptionChange}
                        placeholder="Describe what students will learn in your course..."
                        rows={5}
                        maxLength={500}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                 focus:ring-2 focus:ring-purple-600 focus:border-transparent
                                 transition-all"
                    />
                    <div className="text-right text-sm text-gray-500">
                        {charCount}/500 characters
                    </div>
                </div>
            </motion.div>

            {userCourseInput?.topic && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 rounded-lg p-6 mt-8"
                >
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">
                        Course Preview
                    </h3>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="font-medium text-gray-900">
                            {userCourseInput.topic}
                        </p>
                        {userCourseInput.description && (
                            <p className="text-gray-600 mt-2">
                                {userCourseInput.description}
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default TopicDescription;