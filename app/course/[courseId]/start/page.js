"use client"
import { db } from '@/configs/db'
import { Chapters, CourseList } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import ChapterListCard from './_components/ChapterListCard'
import ChapterContent from './_components/ChapterContent'
import { useParams } from 'next/navigation'
import { GenerateChapterContent_AI } from '@/configs/AiModel'
import service from '@/configs/service'
import GenerationStatus from './_components/GenerationStatus'
import { LoadingState } from './_components/LoadingState'

// Define content template first since it's used by other functions
const contentTemplate = {
    content: [
        {
            title: "🎯 Chapter Introduction",
            description: "",
            keyPoints: [],
            funFact: "",
            trivia: {
                question: "",
                answer: "",
                didYouKnow: ""
            }
        },
        {
            title: "🔍 Deep Dive into Concepts",
            description: "",
            sections: [
                {
                    title: "",
                    introduction: "",
                    explanation: "",
                    codeExample: "",
                    realWorldApplication: "",
                    commonMistakes: [],
                    proTips: []
                }
            ]
        },
        {
            title: "⚡ Interactive Learning",
            description: "",
            exercises: [
                {
                    type: "challenge",
                    scenario: "",
                    hints: [],
                    solution: "",
                    explanation: ""
                }
            ],
            miniQuiz: [
                {
                    question: "",
                    options: [],
                    correctAnswer: "",
                    explanation: ""
                }
            ]
        },
        {
            title: "🎯 Chapter Summary",
            keyTakeaways: [],
            nextSteps: "",
            cheatSheet: [],
            furtherLearning: []
        }
    ],
    resources: {
        recommendedVideos: [],
        alternativeVideos: [],
        expertTalks: [],
        additionalReading: [
            {
                title: "",
                url: "",
                description: "",
                keyPoints: []
            }
        ]
    }
};

function CourseStart() {
    // State declarations
    const params = useParams();
    const [course, setCourse] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [chapterContent, setChapterContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState(null);
    const [generationStep, setGenerationStep] = useState(null);
    const [devMode, setDevMode] = useState(false);
    const [devToolsTab, setDevToolsTab] = useState('raw');
    const [rawAIResponse, setRawAIResponse] = useState(null);

        // Utility Functions
        const createChapterPrompt = (chapter, courseName) => {
            return `Generate educational content for chapter "${chapter?.name}" in the course "${courseName}".
    IMPORTANT: Return ONLY valid JSON matching this exact structure. No additional text or formatting.
    
    ${JSON.stringify(contentTemplate, null, 2)}
    
    REQUIREMENTS:
    1. Start with { and end with }
    2. Use double quotes for strings
    3. No trailing commas
    4. Match structure exactly
    5. Make content engaging and educational
    6. Include practical examples`;
        };
    
        const processAIResponse = (responseText, chapterName) => {
            try {
                // Clean the response
                let cleanText = responseText
                    .trim()
                    .replace(/```json\n?|```/g, '')
                    .replace(/[\u200B-\u200D\uFEFF]/g, '')
                    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
    
                // Extract JSON
                const jsonStart = cleanText.indexOf('{');
                const jsonEnd = cleanText.lastIndexOf('}') + 1;
                
                if (jsonStart === -1 || jsonEnd <= jsonStart) {
                    throw new Error("No valid JSON found in response");
                }
    
                cleanText = cleanText.slice(jsonStart, jsonEnd);
    
                // Parse JSON
                let content;
                try {
                    content = JSON.parse(cleanText);
                } catch (parseError) {
                    console.error("Parse error:", parseError);
                    // Try more aggressive cleaning
                    cleanText = cleanText
                        .replace(/\n/g, ' ')
                        .replace(/\r/g, ' ')
                        .replace(/\t/g, ' ')
                        .replace(/\s+/g, ' ')
                        .replace(/,\s*([}\]])/g, '$1')
                        .trim();
                    content = JSON.parse(cleanText);
                }
    
                // Validate structure
                if (!content?.content || !Array.isArray(content.content)) {
                    throw new Error("Invalid content structure");
                }
    
                // Merge with template
                return {
                    ...contentTemplate,
                    ...content,
                    content: content.content.map((section, index) => ({
                        ...contentTemplate.content[Math.min(index, contentTemplate.content.length - 1)],
                        ...section
                    }))
                };
            } catch (error) {
                console.error("Error processing AI response:", error);
                return createFallbackContent(chapterName, error.message);
            }
        };
    
        const getRelevantVideos = async (chapter, course, content) => {
            try {
                const API_KEY = process.env.YOUTUBE_API_KEY;
                if (!API_KEY) {
                    console.log("YouTube API key not configured");
                    return getEmptyVideoStructure();
                }
    
                setGenerationStep('video');
                const searchQuery = `${chapter.name} ${course.name} tutorial`;
                
                try {
                    const response = await fetch(
                        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&maxResults=10&type=video&key=${API_KEY}`
                    );
    
                    if (!response.ok) {
                        throw new Error(`YouTube API error: ${response.status}`);
                    }
    
                    const data = await response.json();
                    if (!data.items?.length) {
                        return getEmptyVideoStructure();
                    }
    
                    const videos = data.items.map(item => ({
                        videoId: item.id.videoId,
                        title: item.snippet.title,
                        description: item.snippet.description
                    }));
    
                    return {
                        recommendedVideos: videos.slice(0, 3).map(v => v.videoId),
                        alternativeVideos: videos.slice(3, 6).map(v => v.videoId),
                        expertTalks: videos.slice(6, 8).map(v => v.videoId)
                    };
    
                } catch (error) {
                    console.error("Error fetching videos:", error);
                    return getEmptyVideoStructure();
                }
            } catch (error) {
                console.error("Error in video processing:", error);
                return getEmptyVideoStructure();
            }
        };
    
        const getEmptyVideoStructure = () => ({
            recommendedVideos: [],
            alternativeVideos: [],
            expertTalks: []
        });
    
        const createFallbackContent = (chapterName, errorMessage) => ({
            content: [
                {
                    title: "🚨 Content Generation Error",
                    description: `We encountered an issue generating content for ${chapterName}.`,
                    keyPoints: [
                        `Error: ${errorMessage}`,
                        "The system will attempt to regenerate this content",
                        "Please try again or use the developer tools"
                    ],
                    trivia: {
                        question: "Would you like to try regenerating the content?",
                        answer: "Yes, use the developer tools to regenerate",
                        didYouKnow: "Our AI system is continuously improving!"
                    }
                }
            ],
            resources: {
                recommendedVideos: [],
                alternativeVideos: [],
                expertTalks: [],
                additionalReading: [
                    {
                        title: "System Documentation",
                        url: "#",
                        description: "Learn more about content generation",
                        keyPoints: ["Error handling", "Regeneration process", "Support contacts"]
                    }
                ]
            }
        });

            // Effects
    useEffect(() => {
        const courseId = params?.courseId;
        if (courseId) {
            GetCourse();
        }
    }, [params]);

    useEffect(() => {
        if (course?.courseOutput?.course?.chapters?.length > 0) {
            const initialChapter = course.courseOutput.course.chapters[0];
            if (initialChapter) {
                setSelectedChapter({
                    ...initialChapter,
                    chapterId: 0
                });
                GetSelectedChapterContent(0);
            }
        }
    }, [course]);

    // Main Functions
    const GetCourse = async () => {
        const courseId = params?.courseId;
        if (!courseId) return;
        
        try {
            setLoading(true);
            const result = await db.select().from(CourseList)
                .where(eq(CourseList.courseId, courseId));
            
            if (result?.[0]) {
                console.log("Course loaded:", result[0]);
                setCourse(result[0]);
            } else {
                throw new Error("Course not found");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    const GetSelectedChapterContent = async (chapterId) => {
        try {
            setContentLoading(true);
            const courseId = params?.courseId;
            
            // Validate parameters
            if (!courseId) throw new Error("Course ID is missing");
            if (chapterId === undefined || chapterId === null) {
                throw new Error("Chapter ID is missing");
            }

            console.log("Fetching content for:", { courseId, chapterId });

            const result = await db.select().from(Chapters)
                .where(and(
                    eq(Chapters.chapterId, chapterId),
                    eq(Chapters.courseId, courseId)
                ));
            
            if (!result?.[0]) {
                // Generate new content
                const chapter = course?.courseOutput?.course?.chapters[chapterId];
                if (!chapter) throw new Error(`Chapter ${chapterId} not found`);

                try {
                    setGenerationStep('content');
                    const chapterPrompt = createChapterPrompt(chapter, course.name);
                    const aiResponse = await GenerateChapterContent_AI.sendMessage(chapterPrompt);
                    
                    const rawResponse = aiResponse.response.text();
                    setRawAIResponse(rawResponse);
                    
                    let content = processAIResponse(rawResponse, chapter.name);
                    
                    setGenerationStep('video');
                    const videos = await getRelevantVideos(chapter, course, content);
                    content.resources = {
                        ...content.resources,
                        ...videos
                    };

                    setGenerationStep('saving');
                    await db.insert(Chapters).values({
                        chapterId: chapterId,
                        courseId: courseId,
                        content: content,
                        videoId: content.resources.recommendedVideos[0] || ''
                    });

                    setChapterContent(content);

                } catch (error) {
                    console.error("Content generation error:", error);
                    setChapterContent(createFallbackContent(chapter.name, error.message));
                }
            } else {
                // Load existing content
                const chapterData = result[0];
                try {
                    const parsedContent = typeof chapterData.content === 'string' 
                        ? JSON.parse(chapterData.content) 
                        : chapterData.content;
                    
                    setRawAIResponse(
                        typeof chapterData.content === 'string' 
                            ? chapterData.content 
                            : JSON.stringify(chapterData.content, null, 2)
                    );
                    
                    setChapterContent(parsedContent);
                } catch (error) {
                    console.error("Error parsing existing content:", error);
                    setChapterContent(createFallbackContent(
                        course?.courseOutput?.course?.chapters[chapterId]?.name || `Chapter ${chapterId}`,
                        "Error loading saved content"
                    ));
                }
            }
        } catch (error) {
            console.error("Error in GetSelectedChapterContent:", error);
            setChapterContent(createFallbackContent(
                `Chapter ${chapterId}`,
                error.message
            ));
        } finally {
            setContentLoading(false);
            setGenerationStep(null);
        }
    };

    const regenerateCurrentChapter = async () => {
        if (!selectedChapter) return;
        
        try {
            setRegenerating(true);
            setGenerationStatus({ 
                active: true,
                message: `Regenerating: ${selectedChapter.name}`
            });

            const chapterId = selectedChapter.chapterId ?? 
                course?.courseOutput?.course?.chapters?.findIndex(
                    ch => ch.name === selectedChapter.name
                );

            if (chapterId === undefined || chapterId === -1) {
                throw new Error("Could not determine chapter ID");
            }

            await db.delete(Chapters)
                .where(and(
                    eq(Chapters.chapterId, chapterId),
                    eq(Chapters.courseId, params.courseId)
                ));

            await GetSelectedChapterContent(chapterId);

            setGenerationStatus({
                active: true,
                message: 'Successfully regenerated chapter',
                success: true
            });

        } catch (error) {
            setGenerationStatus({ 
                error: `Regeneration failed: ${error.message}`,
                active: false 
            });
        } finally {
            setRegenerating(false);
            setTimeout(() => setGenerationStatus(null), 3000);
        }
    };

    const regenerateAllChapters = async () => {
        try {
            setRegenerating(true);
            setGenerationStatus({ 
                active: true,
                message: 'Initializing full regeneration'
            });
            
            const chapters = course?.courseOutput?.course?.chapters;
            if (!chapters?.length) {
                throw new Error('No chapters found');
            }

            for (const [index, chapter] of chapters.entries()) {
                try {
                    await db.delete(Chapters)
                        .where(and(
                            eq(Chapters.chapterId, index),
                            eq(Chapters.courseId, params.courseId)
                        ));

                    setGenerationStep('init');
                    setGenerationStatus({ 
                        active: true,
                        message: `Generating ${index + 1}/${chapters.length}: ${chapter.name}`,
                        currentChapter: index
                    });

                    await GetSelectedChapterContent(index);

                } catch (error) {
                    console.error(`Failed at chapter ${index + 1}:`, error);
                    setGenerationStatus({ 
                        error: `Failed at chapter ${index + 1}: ${error.message}`,
                        currentChapter: index
                    });
                }
            }

        } catch (error) {
            setGenerationStatus({ 
                error: error.message,
                active: false 
            });
        } finally {
            setRegenerating(false);
            setGenerationStep(null);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dev Tools Button */}
            <button
                onClick={() => setDevMode(!devMode)}
                className="fixed bottom-4 right-4 z-50 bg-black text-green-500 px-4 py-2 rounded-md 
                          hover:bg-gray-900 transition-all flex items-center gap-2 border border-green-500
                          font-mono text-sm shadow-[0_0_10px_rgba(34,197,94,0.3)]"
            >
                <span className="text-lg animate-pulse">⚡</span>
                {devMode ? '>> EXIT_DEV_MODE' : '>> ENTER_DEV_MODE'}
            </button>

            {/* Dev Tools Panel */}
            {devMode && (
                <div className="fixed right-4 bottom-16 w-[600px] max-h-[80vh] bg-black border border-green-500 
                               text-green-500 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.2)] z-50 overflow-hidden
                               font-mono"
                >
                    {/* Dev Tools Header */}
                    <div className="p-4 border-b border-green-500/30 flex justify-between items-center bg-black">
                        <div className="flex items-center gap-4">
                            <div className="animate-pulse">$</div>
                            <h3 className="font-bold tracking-wider">DEV_CONSOLE</h3>
                        </div>
                        <div className="flex gap-2 text-xs">
                            <div className="px-2 py-1 bg-green-500/10 rounded">
                                STATUS: {regenerating ? 'BUSY' : 'READY'}
                            </div>
                            <div className="px-2 py-1 bg-green-500/10 rounded">
                                CHAPTER: {selectedChapter?.chapterId ?? 'NULL'}
                            </div>
                        </div>
                    </div>

                    {/* Dev Tools Tabs */}
                    <div className="flex border-b border-green-500/30">
                        {['raw', 'controls', 'status'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setDevToolsTab(tab)}
                                className={`px-4 py-2 text-sm ${
                                    devToolsTab === tab 
                                        ? 'bg-green-500/10 text-green-400' 
                                        : 'text-green-600 hover:text-green-400'
                                }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Dev Tools Content */}
                    <div className="p-4 overflow-auto max-h-[calc(80vh-8rem)] dev-panel">
                        {devToolsTab === 'raw' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-green-600">// Raw AI Response Data</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => rawAIResponse && navigator.clipboard.writeText(rawAIResponse)}
                                            className="px-2 py-1 bg-green-500/10 rounded text-xs hover:bg-green-500/20"
                                            disabled={!rawAIResponse}
                                        >
                                            COPY_DATA
                                        </button>
                                        <button
                                            onClick={() => setRawAIResponse(null)}
                                            className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20"
                                            disabled={!rawAIResponse}
                                        >
                                            CLEAR_DATA
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/50 p-4 rounded border border-green-500/30">
                                    {rawAIResponse ? (
                                        <pre className="text-xs whitespace-pre-wrap break-words text-green-400">
                                            {typeof rawAIResponse === 'string' 
                                                ? rawAIResponse 
                                                : JSON.stringify(rawAIResponse, null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="text-green-600 text-center py-4">
                                            // No data available. Generate or select content to view raw data.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {devToolsTab === 'controls' && (
                            <div className="space-y-4">
                                <div className="text-xs text-green-600 mb-4">
                                    // Generation Controls
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={regenerateCurrentChapter}
                                        disabled={regenerating || !selectedChapter}
                                        className="p-4 bg-green-500/10 rounded border border-green-500/30 
                                                 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                                                 text-left space-y-2"
                                    >
                                        <div className="text-sm font-bold">REGENERATE_CURRENT</div>
                                        <div className="text-xs text-green-600">
                                            // Regenerate selected chapter content
                                        </div>
                                    </button>
                                    <button
                                        onClick={regenerateAllChapters}
                                        disabled={regenerating}
                                        className="p-4 bg-green-500/10 rounded border border-green-500/30 
                                                 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                                                 text-left space-y-2"
                                    >
                                        <div className="text-sm font-bold">REGENERATE_ALL</div>
                                        <div className="text-xs text-green-600">
                                            // Regenerate all chapters
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {devToolsTab === 'status' && (
                            <div className="space-y-4">
                                <div className="text-xs text-green-600 mb-4">
                                    // System Status
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-black/50 p-4 rounded border border-green-500/30">
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>Selected Chapter:</div>
                                            <div>{selectedChapter?.name || 'NULL'}</div>
                                            <div>Generation Step:</div>
                                            <div>{generationStep || 'IDLE'}</div>
                                            <div>System Status:</div>
                                            <div>{loading ? 'LOADING' : contentLoading ? 'GENERATING' : 'READY'}</div>
                                        </div>
                                    </div>
                                    {generationStatus && (
                                        <div className="bg-black/50 p-4 rounded border border-green-500/30">
                                            <div className="text-sm mb-2">Latest Status:</div>
                                            <div className="text-xs text-green-400">{generationStatus.message}</div>
                                            {generationStatus.error && (
                                                <div className="text-xs text-red-400 mt-2">
                                                    ERROR: {generationStatus.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className='fixed md:w-72 hidden md:block h-screen border-r shadow-sm'>
                <div className='bg-primary p-4'>
                    <h2 className='font-medium text-lg text-white'>
                        {course?.courseOutput?.course?.name || 'Loading course...'}
                    </h2>
                </div>

                <div className="h-[calc(100vh-80px)] overflow-y-auto">
                    {loading ? (
                        Array(5).fill(0).map((_, index) => (
                            <div key={index} className="p-4 border-b animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))
                    ) : (
                        course?.courseOutput?.course?.chapters?.map((chapter, index) => (
                            <div 
                                key={index}
                                className={`cursor-pointer hover:bg-purple-50 ${
                                    selectedChapter?.name === chapter?.name ? 'bg-purple-100' : ''
                                }`}
                                onClick={() => {
                                    setSelectedChapter({
                                        ...chapter,
                                        chapterId: index
                                    });
                                    GetSelectedChapterContent(index);
                                }}
                            >
                                <ChapterListCard chapter={chapter} index={index} />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className='md:ml-72 min-h-screen relative'>
                {contentLoading && (
                    <LoadingState 
                        step={generationStep}
                        message={
                            generationStep === 'video' 
                                ? 'Finding relevant video resources...'
                                : 'Loading content...'
                        }
                    />
                )}
                
                {!loading && selectedChapter ? (
                    chapterContent ? (
                        <ChapterContent 
                            chapter={selectedChapter}
                            content={chapterContent}
                        />
                    ) : (
                        <div className='p-10'>
                            <h2 className='text-xl font-medium'>No content available for this chapter</h2>
                            <p className='text-gray-500 mt-2'>Selected Chapter: {selectedChapter.name}</p>
                        </div>
                    )
                ) : (
                    <div className='p-10'>
                        {loading ? 'Loading course content...' : 'Select a chapter to view content'}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseStart;