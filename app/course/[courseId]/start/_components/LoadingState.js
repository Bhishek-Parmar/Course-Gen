// app/course/[courseId]/start/_components/LoadingState.js

import React from 'react';

export const LoadingState = ({ message, step }) => {
    const getStepMessage = () => {
        switch (step) {
            case 'init':
                return 'Initializing content generation...';
            case 'content':
                return 'Generating chapter content...';
            case 'video':
                return 'Finding relevant video resources...';
            case 'saving':
                return 'Saving generated content...';
            default:
                return message || 'Loading...';
        }
    };

    return (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-xl border max-w-md w-full mx-4">
                <div className="flex items-center space-x-4">
                    {/* Spinner */}
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-purple-200 rounded-full"></div>
                        <div className="w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                    </div>
                    
                    {/* Message */}
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                            {getStepMessage()}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Please wait while we prepare your content
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                {step && (
                    <div className="mt-4 space-y-2">
                        <div className="flex space-x-2 items-center text-sm">
                            <div className={`w-2 h-2 rounded-full ${step === 'init' ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
                            <span className={step === 'init' ? 'text-purple-500' : 'text-gray-400'}>Initialization</span>
                        </div>
                        <div className="flex space-x-2 items-center text-sm">
                            <div className={`w-2 h-2 rounded-full ${step === 'content' ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
                            <span className={step === 'content' ? 'text-purple-500' : 'text-gray-400'}>Content Generation</span>
                        </div>
                        <div className="flex space-x-2 items-center text-sm">
                            <div className={`w-2 h-2 rounded-full ${step === 'video' ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
                            <span className={step === 'video' ? 'text-purple-500' : 'text-gray-400'}>Video Resources</span>
                        </div>
                        <div className="flex space-x-2 items-center text-sm">
                            <div className={`w-2 h-2 rounded-full ${step === 'saving' ? 'bg-purple-500' : 'bg-gray-200'}`}></div>
                            <span className={step === 'saving' ? 'text-purple-500' : 'text-gray-400'}>Saving Content</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingState;