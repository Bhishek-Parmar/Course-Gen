// _components/SelectCategory.jsx
"use client";
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { UserInputContext } from '../../_context/UserInputContext';

const categories = [
    {
        id: 1,
        name: 'Programming & Technology',
        icon: '💻',
        description: 'Software development, web technologies, and IT skills',
        subcategories: ['Web Development', 'Mobile Development', 'Data Science', 'DevOps', 'Cybersecurity']
    },
    {
        id: 2,
        name: 'Business & Management',
        icon: '📊',
        description: 'Business strategy, management, and entrepreneurship',
        subcategories: ['Marketing', 'Finance', 'Entrepreneurship', 'Leadership', 'Project Management']
    },
    {
        id: 3,
        name: 'Design & Creative',
        icon: '🎨',
        description: 'UI/UX design, graphic design, and creative skills',
        subcategories: ['UI/UX Design', 'Graphic Design', 'Motion Graphics', '3D Modeling', 'Digital Art']
    },
    {
        id: 4,
        name: 'Personal Development',
        icon: '🌱',
        description: 'Self-improvement, productivity, and life skills',
        subcategories: ['Productivity', 'Communication', 'Leadership', 'Time Management', 'Public Speaking']
    }
];

const SelectCategory = () => {
    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

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
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Your Course Category
                </h2>
                <p className="text-gray-600">
                    Select the main category that best fits your course content
                </p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {categories.map((category) => (
                    <motion.div
                        key={category.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setUserCourseInput({
                            ...userCourseInput,
                            category: category.name
                        })}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all
                            ${userCourseInput?.category === category.name 
                                ? 'border-purple-600 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'}`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="text-4xl">{category.icon}</div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {category.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {category.subcategories.map((sub, index) => (
                                        <span 
                                            key={index}
                                            className="text-xs px-2 py-1 bg-white rounded-full
                                                     border border-gray-200 text-gray-600"
                                        >
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0
                                ${userCourseInput?.category === category.name
                                    ? 'border-purple-600 bg-purple-600'
                                    : 'border-gray-300'}`}
                            >
                                {userCourseInput?.category === category.name && (
                                    <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-full h-full text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </motion.svg>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {userCourseInput?.category && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-8 p-4 bg-purple-50 rounded-lg"
                >
                    <p className="text-purple-600 font-medium">
                        Selected Category: {userCourseInput.category}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Great choice! This category has high demand for quality courses.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SelectCategory;