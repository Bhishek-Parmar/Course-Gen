import React, { useState } from 'react'
import YouTube from 'react-youtube'
import ReactMarkdown from 'react-markdown';
import { HiLightBulb, HiCode, HiPuzzle, HiAcademicCap, HiPlay } from "react-icons/hi";

const opts = {
    height: '390',
    width: '100%',
    playerVars: {
        autoplay: 0,
    },
};

function ChapterContent({chapter, content}) {
    const [videoLoading, setVideoLoading] = useState(false);
    const [activeExercise, setActiveExercise] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Ensure content is properly structured
    const contentSections = Array.isArray(content?.content) 
        ? content.content 
        : typeof content?.content === 'string'
        ? JSON.parse(content.content)
        : [];

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Main Content */}
            <div className="md:w-2/3 space-y-8">
                {contentSections.map((section, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border">
                        <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                        <p className="text-gray-600 mb-4">{section.description}</p>

                        {/* Introduction Section */}
                        {section.funFact && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <p className="font-medium">🎯 Fun Fact</p>
                                <p className="text-gray-600">{section.funFact}</p>
                            </div>
                        )}

                        {/* Key Points */}
                        {section.keyPoints && (
                            <div className="space-y-2 mb-4">
                                {section.keyPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        <p>{point}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Trivia Section */}
                        {section.trivia && (
                            <div className="bg-purple-50 p-4 rounded-lg mb-4">
                                <p className="font-medium mb-2">🎲 Trivia Time</p>
                                <p className="mb-2">{section.trivia.question}</p>
                                <div className="bg-white p-3 rounded mt-2">
                                    <p className="text-gray-600">{section.trivia.answer}</p>
                                </div>
                                <p className="text-sm mt-2 text-purple-600">
                                    {section.trivia.didYouKnow}
                                </p>
                            </div>
                        )}

                        {/* Concept Sections */}
                        {section.sections?.map((concept, idx) => (
                            <div key={idx} className="border-l-4 border-primary pl-4 mt-6">
                                <h3 className="font-bold text-lg mb-2">{concept.title}</h3>
                                <p className="text-gray-600 mb-2">{concept.introduction}</p>
                                <p className="mb-4">{concept.explanation}</p>
                                
                                {concept.codeExample && (
                                    <pre className="bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
                                        <code>{concept.codeExample}</code>
                                    </pre>
                                )}
                                
                                <div className="bg-green-50 p-4 rounded-lg mb-4">
                                    <p className="font-medium">🌟 Real-World Application</p>
                                    <p className="text-gray-600">{concept.realWorldApplication}</p>
                                </div>
                            </div>
                        ))}

                        {/* Interactive Exercises */}
                        {section.exercises?.map((exercise, idx) => (
                            <div key={idx} className="border border-primary rounded-lg p-4 mt-6">
                                <h3 className="font-bold text-lg mb-2">
                                    <HiPuzzle className="inline mr-2" />
                                    Practice Challenge
                                </h3>
                                <p className="mb-4">{exercise.scenario}</p>
                                <div className="space-y-2">
                                    {exercise.hints.map((hint, hintIdx) => (
                                        <p key={hintIdx} className="text-gray-600">
                                            💡 Hint {hintIdx + 1}: {hint}
                                        </p>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setShowAnswer(prev => !prev)}
                                    className="mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg"
                                >
                                    {showAnswer ? 'Hide Solution' : 'Show Solution'}
                                </button>
                                {showAnswer && (
                                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">Solution:</p>
                                        <p>{exercise.solution}</p>
                                        <p className="mt-2 text-gray-600">{exercise.explanation}</p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Knowledge Check */}
                        {section.interactiveQuiz?.map((quiz, idx) => (
                            <div key={idx} className="bg-yellow-50 p-4 rounded-lg mt-6">
                                <h3 className="font-bold text-lg mb-2">
                                    <HiAcademicCap className="inline mr-2" />
                                    Knowledge Check
                                </h3>
                                <p className="mb-4">{quiz.question}</p>
                                <div className="space-y-2">
                                    {quiz.options.map((option, optIdx) => (
                                        <button
                                            key={optIdx}
                                            className="w-full text-left p-3 rounded-lg hover:bg-yellow-100 transition-all"
                                            onClick={() => setActiveExercise(optIdx)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Sidebar Content */}
            <div className="md:w-1/3 space-y-6">
                {/* Video Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border sticky top-6">
                    <h3 className="text-xl font-bold mb-4">📺 Learning Resources</h3>
                    
                    {/* Main Video */}
                    {content?.resources?.recommendedVideos?.[0] && (
                        <div className="mb-6">
                            <YouTube
                                videoId={selectedVideo || content.resources.recommendedVideos[0]}
                                opts={opts}
                                className="w-full"
                                onReady={() => setVideoLoading(false)}
                            />
                        </div>
                    )}

                    {/* Alternative Videos */}
                    {content?.resources?.alternativeVideos?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Alternative Videos</h4>
                            <div className="space-y-2">
                                {content.resources.alternativeVideos.map((videoId, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedVideo(videoId)}
                                        className="w-full text-left p-2 rounded hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <HiPlay className="text-primary" />
                                        <span>Alternative Explanation {idx + 1}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expert Talks */}
                    {content?.resources?.expertTalks?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Expert Insights</h4>
                            <div className="space-y-2">
                                {content.resources.expertTalks.map((videoId, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedVideo(videoId)}
                                        className="w-full text-left p-2 rounded hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <HiLightBulb className="text-primary" />
                                        <span>Expert Talk {idx + 1}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Resources */}
                {content?.resources?.additionalReading && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border">
                        <h3 className="text-xl font-bold mb-4">📚 Additional Resources</h3>
                        <div className="space-y-3">
                            {content.resources.additionalReading.map((resource, index) => (
                                <a 
                                    key={index}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-all"
                                >
                                    <h4 className="font-medium text-primary">{resource.title}</h4>
                                    <p className="text-sm text-gray-600">{resource.description}</p>
                                    {resource.keyPoints && (
                                        <ul className="mt-2 text-sm text-gray-500">
                                            {resource.keyPoints.map((point, idx) => (
                                                <li key={idx}>• {point}</li>
                                            ))}
                                        </ul>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChapterContent;