import React from 'react';
import { HiRefresh, HiCheck, HiExclamation } from 'react-icons/hi';

function GenerationStatus({ status, currentChapter, totalChapters, step }) {
    const steps = [
        { id: 'init', title: '🚀 Initializing Generation' },
        { id: 'video', title: '🎥 Finding Relevant Videos' },
        { id: 'content', title: '✍️ Creating Chapter Content' },
        { id: 'saving', title: '💾 Saving to Database' }
    ];

    return (
        <div className="fixed bottom-6 right-6 bg-white p-6 rounded-xl shadow-lg border w-96 z-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Generating Content</h3>
                <span className="text-sm text-primary">
                    Chapter {currentChapter + 1}/{totalChapters}
                </span>
            </div>

            <div className="space-y-3">
                {steps.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                        {step === s.id && <HiRefresh className="animate-spin text-primary" />}
                        {step > s.id && <HiCheck className="text-green-500" />}
                        {status?.error && step === s.id && <HiExclamation className="text-red-500" />}
                        <span className={step === s.id ? 'text-primary font-medium' : 'text-gray-500'}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            {status?.error && (
                <div className="mt-3 text-sm text-red-500">
                    Error: {status.error}
                </div>
            )}
        </div>
    );
}

export default GenerationStatus; 