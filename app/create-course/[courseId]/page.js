"use client"
import { db } from '@/configs/db'
import { Chapters, CourseList } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import CourseBasicInfo from './_components/CourseBasicInfo'
import CourseDetails from './_components/CourseDetails'
import ChapterList from './_components/ChapterList'
import { Button } from '@/components/ui/button'
import { GenerateChapterContent_AI } from '@/configs/AiModel'
import LoadingDialog from '../_components/LoadingDialog'
import service from '@/configs/service'
import { useRouter, useParams } from 'next/navigation'
import GenerationStatus from './_components/GenerationStatus'
import ChapterContent from './_components/ChapterContent'

function CourseLayout() {
  const params = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [generationStep, setGenerationStep] = useState(null);
  const [chapterContents, setChapterContents] = useState({});

  const GetCourse = async () => {
    const courseId = params?.courseId;
    if (!courseId) return;
    
    const result = await db.select().from(CourseList)
      .where(and(
        eq(CourseList.courseId, courseId),
        eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
      ));
    
    setCourse(result[0]);
  }

  useEffect(() => {
    if (params?.courseId && user) {
      GetCourse();
    }
  }, [params, user]);

  useEffect(() => {
    const fetchExistingContent = async () => {
      if (course?.courseId) {
        try {
          const results = await db.select().from(Chapters)
            .where(eq(Chapters.courseId, course.courseId));
          
          const contents = {};
          results.forEach(result => {
            contents[result.chapterId] = result.content;
          });
          setChapterContents(contents);
        } catch (error) {
          console.error("Error fetching chapter contents:", error);
        }
      }
    };

    fetchExistingContent();
  }, [course?.courseId]);

  const getVideos = async (query, maxResults = 3) => {
    try {
        setGenerationStep('video');
        const videoResults = await service.getVideos(query, maxResults);
        if (!videoResults || videoResults.length === 0) {
            console.warn('No videos found, continuing without videos');
            return [];
        }
        return videoResults?.map(video => video?.id?.videoId).filter(Boolean);
    } catch (error) {
        console.error('Error fetching videos:', error);
        // Continue without videos instead of failing the whole generation
        return [];
    }
  };

  const GenerateChapterContent = async () => {
    setLoading(true);
    const chapters = course?.courseOutput?.course?.chapters;
    
    if (!chapters || chapters.length === 0) {
        setGenerationStatus({ 
            error: 'No chapters found to generate',
            active: false 
        });
        return;
    }

    try {
        for (const [index, chapter] of chapters.entries()) {
            try {
                setGenerationStep('init');
                setGenerationStatus({ 
                    active: true,
                    message: `Generating Chapter ${index + 1}/${chapters.length}: ${chapter.name}`,
                    currentChapter: index
                });

                // Get videos with error handling
                const videoIds = await getVideos(`${course?.name}: ${chapter?.name} tutorial`);

                // Generate content
                setGenerationStep('content');
                const chapterPrompt = `Create a highly detailed, engaging, and interactive tutorial for "${chapter?.name}" in the course "${course?.name}". The response must be a valid JSON object with this exact structure:
                {
                    "content": [
                        {
                            "title": "🎯 Main Topic",
                            "description": "Clear and engaging description of the topic",
                            "keyPoints": [
                                "Key point 1",
                                "Key point 2",
                                "Key point 3"
                            ],
                            "sections": [
                                {
                                    "title": "Section Title",
                                    "explanation": "Detailed explanation with examples",
                                    "codeExample": "Optional code example if relevant"
                                }
                            ]
                        }
                    ],
                    "resources": {
                        "recommendedVideos": [],
                        "additionalReading": [
                            "Resource 1",
                            "Resource 2"
                        ]
                    }
                }`;

                const result = await GenerateChapterContent_AI.sendMessage(chapterPrompt);
                
                // Safely parse JSON
                let content;
                try {
                    content = JSON.parse(result?.response?.text());
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    throw new Error('Failed to parse AI response');
                }

                // Validate content structure
                if (!content?.content || !Array.isArray(content.content)) {
                    throw new Error('Invalid content structure received from AI');
                }

                content.resources = {
                    ...content.resources,
                    recommendedVideos: videoIds
                };

                // Save to database
                setGenerationStep('saving');
                await db.insert(Chapters).values({
                    chapterId: index,
                    courseId: course?.courseId,
                    content: JSON.stringify(content),
                    videoId: videoIds[0] || ''
                });

                setChapterContents(prev => ({...prev, [index]: content}));

            } catch (error) {
                console.error(`Error generating chapter ${index}:`, error);
                setGenerationStatus({ 
                    error: `Error in Chapter ${index + 1}: ${error.message}`,
                    currentChapter: index
                });
                continue;
            }
        }

        await db.update(CourseList)
            .set({ publish: true })
            .where(eq(CourseList.courseId, course?.courseId));

        router.replace('/create-course/' + course?.courseId + "/finish");
    } catch (error) {
        setGenerationStatus({ 
            error: error.message,
            active: false 
        });
    } finally {
        setLoading(false);
        setGenerationStep(null);
    }
};
  return (
    <div className="min-h-screen bg-gray-50">
        {/* ... existing sidebar code ... */}

        {/* Content Area */}
        <div className="md:ml-72 p-6">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {course?.courseOutput?.course?.chapters?.map((chapter, index) => (
                        <div key={index} className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">{chapter.name}</h2>
                            {chapterContents[index] ? (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <ChapterContent 
                                        chapter={chapter}
                                        content={chapterContents[index]}
                                    />
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    Content not generated yet
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Generation Status */}
        {(generationStatus?.active || generationStep) && (
            <GenerationStatus 
                status={generationStatus}
                currentChapter={generationStatus?.currentChapter || 0}
                totalChapters={course?.courseOutput?.course?.chapters?.length || 0}
                step={generationStep}
            />
        )}
    </div>
  )
}

export default CourseLayout