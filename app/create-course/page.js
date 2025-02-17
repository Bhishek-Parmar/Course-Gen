"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    HiOutlineAcademicCap, 
    HiOutlineBookOpen, 
    HiOutlineCog,
    HiOutlineSparkles 
} from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/configs/db";

const CreateCourse = () => {
    const StepperOptions = [
        {
            id: 1,
            name: 'Course Category',
            description: 'Select the main category for your course',
            icon: <HiOutlineAcademicCap className="w-6 h-6" />
        },
        {
            id: 2,
            name: 'Topic & Description',
            description: 'Define your course topic and objectives',
            icon: <HiOutlineBookOpen className="w-6 h-6" />
        },
        {
            id: 3,
            name: 'Course Options',
            description: 'Configure course settings and structure',
            icon: <HiOutlineCog className="w-6 h-6" />
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
    const { user } = useUser();
    const router = useRouter();

    // Animation variants
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

    // Check if current step is complete
    const checkStatus = () => {
        if (!userCourseInput) return true;
        
        switch(activeIndex) {
            case 0:
                return !userCourseInput.category;
            case 1:
                return !userCourseInput.topic;
            case 2:
                return !(userCourseInput.level && 
                        userCourseInput.duration && 
                        userCourseInput.displayVideo !== undefined && 
                        userCourseInput.noOfChapters);
            default:
                return true;
        }
    };

    // Generate course layout with AI
    const GenerateCourseLayout = async () => {
        try {
            setLoading(true);
            const prompt = `Create an engaging and interactive course structure for:
            Topic: ${userCourseInput.topic}
            Category: ${userCourseInput.category}
            Level: ${userCourseInput.level}
            Duration: ${userCourseInput.duration}
            Number of Chapters: ${userCourseInput.noOfChapters}

            Return a JSON object with this exact structure:
            {
                "course": {
                    "name": "Course Name",
                    "description": "Engaging course description with emojis",
                    "learningObjectives": ["objective1", "objective2", "objective3"],
                    "prerequisites": ["prerequisite1", "prerequisite2"],
                    "chapters": [
                        {
                            "name": "Chapter Name with Emoji",
                            "about": "Engaging chapter description",
                            "duration": "Duration in minutes",
                            "keyTakeaways": ["takeaway1", "takeaway2"]
                        }
                    ]
                }
            }`;

            const result = await GenerateCourseLayout_AI.sendMessage(prompt);
            const courseLayout = JSON.parse(result.response?.text());
            await SaveCourseLayoutInDb(courseLayout);
        } catch (error) {
            console.error("Error generating course:", error);
            // Add error handling UI
        } finally {
            setLoading(false);
        }
    };

    // Save to database
    const SaveCourseLayoutInDb = async (courseLayout) => {
        try {
            const courseId = uuidv4();
            await db.insert(CourseList).values({
                courseId,
                name: userCourseInput.topic,
                level: userCourseInput.level,
                category: userCourseInput.category,
                courseOutput: courseLayout,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
                userProfileImage: user?.imageUrl
            });
            router.replace(`/create-course/${courseId}`);
        } catch (error) {
            console.error("Error saving course:", error);
            // Add error handling UI
        }
    };

    return (
        <motion.div 
            className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-10 px-4 sm:px-6 lg:px-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div 
                className="text-center mb-16"
                variants={itemVariants}
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Create Your Course
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Let's transform your knowledge into an engaging learning experience
                </p>
            </motion.div>

            {/* Stepper */}
            <motion.div 
                className="max-w-4xl mx-auto mb-16"
                variants={itemVariants}
            >
                <div className="flex justify-between">
                    {StepperOptions.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className="relative">
                                <motion.div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center
                                              ${activeIndex >= index 
                                                ? 'bg-purple-600 text-white' 
                                                : 'bg-gray-200 text-gray-500'}`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {step.icon}
                                </motion.div>
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 text-center">
                                    <p className="text-sm font-medium text-gray-900">{step.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                                </div>
                            </div>
                            {index < StepperOptions.length - 1 && (
                                <div className={`w-24 h-1 mx-4 rounded ${
                                    activeIndex > index ? 'bg-purple-600' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Content Area */}
            <motion.div 
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
                variants={itemVariants}
            >
                {activeIndex === 0 && <SelectCategory />}
                {activeIndex === 1 && <TopicDescription />}
                {activeIndex === 2 && <SelectOption />}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                        variant="outline"
                        disabled={activeIndex === 0}
                        onClick={() => setActiveIndex(activeIndex - 1)}
                        className="flex items-center gap-2"
                    >
                        ← Previous
                    </Button>
                    
                    {activeIndex < 2 ? (
                        <Button
                            disabled={checkStatus()}
                            onClick={() => setActiveIndex(activeIndex + 1)}
                            className="flex items-center gap-2"
                        >
                            Next →
                        </Button>
                    ) : (
                        <Button
                            disabled={checkStatus()}
                            onClick={GenerateCourseLayout}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                            <HiOutlineSparkles className="w-5 h-5" />
                            Generate Course
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Loading Dialog */}
            <LoadingDialog loading={loading} />
        </motion.div>
    );
};

export default CreateCourse;