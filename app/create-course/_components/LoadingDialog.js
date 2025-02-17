// _components/LoadingDialog.jsx
"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingDialog = ({ loading }) => {
    const steps = [
        "Analyzing course requirements...",
        "Generating course structure...",
        "Creating chapter outlines...",
        "Finalizing course content...",
    ];

    const [currentStep, setCurrentStep] = React.useState(0);

    React.useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setCurrentStep((prev) => (prev + 1) % steps.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl"
                    >
                        <div className="flex flex-col items-center">
                            {/* Loading Animation */}
                            <div className="relative w-24 h-24 mb-6">
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="absolute inset-0 border-4 border-purple-200 rounded-full"
                                />
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="absolute inset-0 border-4 border-t-4 border-purple-600 rounded-full"
                                />
                            </div>

                            {/* Loading Text */}
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Generating Your Course
                            </h3>
                            <AnimatePresence mode='wait'>
                                <motion.p
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-gray-600 text-center"
                                >
                                    {steps[currentStep]}
                                </motion.p>
                            </AnimatePresence>

                            {/* Progress Steps */}
                            <div className="flex space-x-2 mt-6">
                                {steps.map((_, index) => (
                                    <motion.div
                                        key={index}
                                        animate={{
                                            scale: currentStep === index ? 1.2 : 1,
                                            backgroundColor: currentStep === index 
                                                ? "rgb(147, 51, 234)" 
                                                : "rgb(229, 231, 235)"
                                        }}
                                        className="w-2 h-2 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingDialog;