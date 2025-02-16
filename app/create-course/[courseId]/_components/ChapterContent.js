import React, { useState } from 'react';
import YouTube from 'react-youtube';
import ReactMarkdown from 'react-markdown';
import { HiLightBulb, HiCode, HiPuzzle, HiAcademicCap, HiPlay } from "react-icons/hi";

const opts = {
    height: '390',
    width: '100%',
    playerVars: {
        autoplay: 0,
    },
};

function ChapterContent({ chapter, content }) {
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoError, setVideoError] = useState({});
    const [activeExercise, setActiveExercise] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Parse content safely
    let contentSections = [];
    try {
        contentSections = Array.isArray(content?.content) 
            ? content.content 
            : typeof content?.content === 'string'
            ? JSON.parse(content.content)
            : content || [];

        if (!contentSections || !Array.isArray(contentSections)) {
            throw new Error('Invalid content structure');
        }
    } catch (error) {
        console.error("Error parsing content:", error);
        return <div className="p-4 text-red-500">Error loading chapter content</div>;
    }

    if (!contentSections || contentSections.length === 0) {
        return <div className="p-4">No content available for this chapter</div>;
    }

    const handleVideoError = (videoId) => {
        setVideoError(prev => ({
            ...prev,
            [videoId]: true
        }));
        setVideoLoading(false);
    };

    return (
        <div className="space-y-8">
            {/* Chapter Introduction */}
            {contentSections.map((section, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                    <p className="text-gray-700 mb-4">{section.description}</p>

                    {/* Key Points */}
                    {section.keyPoints && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Key Points:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {section.keyPoints.map((point, idx) => (
                                    <li key={idx} className="text-gray-600">{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Trivia Section */}
                    {section.trivia && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">🤔 {section.trivia.question}</h4>
                            {showAnswer ? (
                                <p className="text-gray-700">{section.trivia.answer}</p>
                            ) : (
                                <button 
                                    onClick={() => setShowAnswer(true)}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Show Answer
                                </button>
                            )}
                        </div>
                    )}

                    {/* Concept Sections */}
                    {section.sections && section.sections.map((concept, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-4 mb-4">
                            <h4 className="font-semibold mb-2">{concept.title}</h4>
                            <p className="text-gray-700 mb-2">{concept.explanation}</p>
                            {concept.codeExample && (
                                <pre className="bg-gray-100 p-4 rounded-lg mb-2 overflow-x-auto">
                                    <code>{concept.codeExample}</code>
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {/* Video Section */}
            {content?.resources?.recommendedVideos?.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-4">📺 Related Videos</h3>
                    <div className="space-y-4">
                        {content.resources.recommendedVideos.map((videoId, idx) => (
                            videoId && !videoError[videoId] && (
                                <div key={idx}>
                                    <YouTube 
                                        videoId={videoId}
                                        opts={opts}
                                        onReady={() => setVideoLoading(false)}
                                        onError={() => handleVideoError(videoId)}
                                    />
                                </div>
                            )
                        ))}
                    </div>
                    {Object.keys(videoError).length > 0 && (
                        <p className="text-yellow-500 mt-2">
                            Some videos couldn't be loaded. This might be due to API limits or video availability.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ChapterContent; 