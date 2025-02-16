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

function CourseStart() {
    const params = useParams();
    const [course, setCourse] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [chapterContent, setChapterContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState(null);
    const [generationStep, setGenerationStep] = useState(null);

    // Template for content structure
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

    useEffect(() => {
        const courseId = params?.courseId;
        if (courseId) {
            GetCourse();
        }
    }, [params]);

    useEffect(() => {
        if (course?.courseOutput?.course?.chapters?.length > 0) {
            const initialChapter = course.courseOutput.course.chapters[0];
            setSelectedChapter(initialChapter);
            GetSelectedChapterContent(0);
        }
    }, [course]);

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
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    }

    const GetSelectedChapterContent = async (chapterId) => {
        try {
            setLoading(true);
            const courseId = params?.courseId;
            
            const result = await db.select().from(Chapters)
                .where(and(
                    eq(Chapters.chapterId, chapterId),
                    eq(Chapters.courseId, courseId)
                ));
            
            if (!result?.[0]) {
                const chapter = course?.courseOutput?.course?.chapters[chapterId];
                if (chapter) {
                    try {
                        const chapterPrompt = createChapterPrompt(chapter, course.name);
                        const aiResponse = await GenerateChapterContent_AI.sendMessage(chapterPrompt);
                        
                        let content = processAIResponse(aiResponse.response.text(), chapter.name);
                        
                        const videos = await getRelevantVideos(chapter, course, content);
                        content.resources = {
                            ...content.resources,
                            ...videos
                        };

                        await db.insert(Chapters).values({
                            chapterId: chapterId,
                            courseId: params.courseId,
                            content: content,
                            videoId: content.resources.recommendedVideos[0] || ''
                        });

                        setChapterContent(content);

                    } catch (error) {
                        console.error("Content generation error:", error);
                        setChapterContent(createFallbackContent(chapter.name, error.message));
                    }
                }
            } else {
                const chapterData = result[0];
                try {
                    const parsedContent = typeof chapterData.content === 'string' 
                        ? JSON.parse(chapterData.content) 
                        : chapterData.content;
                    setChapterContent(parsedContent);
                } catch (error) {
                    console.error("Error parsing existing content:", error);
                    setChapterContent(createFallbackContent(
                        course?.courseOutput?.course?.chapters[chapterId]?.name,
                        "Error loading saved content"
                    ));
                }
            }
        } catch (error) {
            console.error("Error in GetSelectedChapterContent:", error);
            setChapterContent(createFallbackContent("Chapter", error.message));
        } finally {
            setLoading(false);
        }
    };

    const processAIResponse = (responseText, chapterName) => {
        try {
            // Extract JSON from response
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            const jsonStr = responseText.slice(jsonStart, jsonEnd);

            // Parse JSON
            let content = JSON.parse(jsonStr);

            // Merge with template to ensure structure
            return {
                ...contentTemplate,
                ...content,
                content: content.content.map((section, index) => ({
                    ...contentTemplate.content[index],
                    ...section
                }))
            };
        } catch (error) {
            console.error("Error processing AI response:", error);
            throw new Error("Failed to process AI response");
        }
    };

    const createChapterPrompt = (chapter, courseName) => {
        return `Generate educational content for chapter "${chapter?.name}" in the course "${courseName}".
Use this exact JSON structure (fill in the empty values):

${JSON.stringify(contentTemplate, null, 2)}

Requirements:
1. Maintain the exact structure shown above
2. Fill in all empty values with relevant content
3. Keep all existing keys and structure
4. Return only valid JSON
5. Make content engaging and educational
6. Include practical examples and real-world applications`;
    };

    const createFallbackContent = (chapterName, errorMessage) => ({
        ...contentTemplate,
        content: [
            {
                ...contentTemplate.content[0],
                title: "🎯 Chapter Content Unavailable",
                description: `We encountered an issue loading the content for ${chapterName}.`,
                keyPoints: [
                    `Error: ${errorMessage}`,
                    "Please try regenerating the content",
                    "If the issue persists, contact support"
                ]
            }
        ]
    });

    const getRelevantVideos = async (chapter, course, content) => {
        try {
            setGenerationStep('video');
            
            const concepts = content.content
                .filter(section => section.title.includes('Concepts'))
                .flatMap(section => section.sections?.map(s => s.title.replace('🌟 ', '')) || [])
                .filter(Boolean);

            const searchQueries = [
                `${chapter.name} ${course.name} tutorial`,
                ...concepts.map(concept => `${concept} in ${course.name} explanation`),
                `${chapter.name} practical examples ${course.name}`
            ];

            const allVideos = await Promise.all(
                searchQueries.map(query => service.getVideos(query, 5))
            );

            const processedVideos = allVideos.flat().filter(video => {
                if (!video?.snippet) return false;
                const title = video.snippet.title?.toLowerCase() || '';
                const description = video.snippet.description?.toLowerCase() || '';
                const keywords = [
                    chapter.name.toLowerCase(),
                    course.name.toLowerCase(),
                    ...concepts.map(c => c.toLowerCase())
                ];
                return keywords.some(keyword => 
                    title.includes(keyword) || description.includes(keyword)
                );
            });

            const uniqueVideos = [...new Map(processedVideos.map(v => [v.id.videoId, v])).values()];
            return {
                recommendedVideos: uniqueVideos.slice(0, 3).map(v => v.id.videoId),
                alternativeVideos: uniqueVideos.slice(3, 6).map(v => v.id.videoId),
                expertTalks: uniqueVideos.slice(6, 8).map(v => v.id.videoId)
            };
        } catch (error) {
            console.error("Error fetching videos:", error);
            return {
                recommendedVideos: [],
                alternativeVideos: [],
                expertTalks: []
            };
        }
    };

    const regenerateChapterContent = async () => {
        try {
            setRegenerating(true);
            setGenerationStatus({ 
                active: true,
                message: 'Initializing content regeneration'
            });
            
            const chapters = course?.courseOutput?.course?.chapters;
            if (!chapters?.length) {
                throw new Error('No chapters found to regenerate');
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
                        message: `Generating Chapter ${index + 1}/${chapters.length}: ${chapter.name}`,
                        currentChapter: index
                    });

                    await GetSelectedChapterContent(index);

                    setGenerationStatus({
                        active: true,
                        message: `Successfully generated Chapter ${index + 1}`,
                        success: true
                    });

                } catch (error) {
                    setGenerationStatus({ 
                        error: `Error in Chapter ${index + 1}: ${error.message}`,
                        currentChapter: index
                    });
                    console.error(`Error generating content for chapter ${index}:`, error);
                }
            }

        } catch (error) {
            setGenerationStatus({ 
                error: error.message,
                active: false 
            });
            console.error("Error in regeneration:", error);
        } finally {
            setRegenerating(false);
            setGenerationStep(null);
            if (!generationStatus?.error) {
                setGenerationStatus(null);
            }
        }
    };

    if (loading) {
        return <div className='p-10'>Loading course content...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Chapter list Side Bar */}
            <div className='fixed md:w-72 hidden md:block h-screen border-r shadow-sm'>
                <div className='bg-primary p-4'>
                    <h2 className='font-medium text-lg text-white'>
                        {course?.courseOutput?.course?.name}
                    </h2>
                    <button
                        onClick={regenerateChapterContent}
                        disabled={regenerating}
                        className='mt-2 w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm transition-all'
                    >
                        {regenerating ? 'Regenerating Content...' : '🔄 Regenerate All Content'}
                    </button>
                </div>

                <div>
                    {course?.courseOutput?.course?.chapters?.map((chapter, index) => (
                        <div 
                            key={index}
                            className={`cursor-pointer hover:bg-purple-50 ${
                                selectedChapter?.name === chapter?.name ? 'bg-purple-100' : ''
                            }`}
                            onClick={() => {
                                setSelectedChapter(chapter);
                                GetSelectedChapterContent(index);
                            }}
                        >
                            <ChapterListCard chapter={chapter} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Div */}
            <div className='md:ml-72'>
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
                    <div className='p-10'>Select a chapter to view content</div>
                )}
            </div>

            {/* Generation Status */}
            {(generationStatus?.active || generationStep) && (
                <GenerationStatus 
                    status={generationStatus}
                    currentChapter={selectedChapter ? 
                        course?.courseOutput?.course?.chapters?.findIndex(
                            ch => ch.name === selectedChapter.name
                        ) : 0}
                    totalChapters={course?.courseOutput?.course?.chapters?.length || 0}
                    step={generationStep}
                />
            )}
        </div>
    );
}

export default CourseStart;