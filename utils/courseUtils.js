// utils/courseUtils.js
export const validateCourseInput = (input) => {
    const required = ['category', 'topic', 'level', 'duration', 'noOfChapters'];
    const missing = required.filter(field => !input[field]);
    
    if (missing.length > 0) {
        return {
            isValid: false,
            errors: missing.map(field => `${field} is required`)
        };
    }

    return { isValid: true, errors: [] };
};

export const generateCoursePrompt = (input) => {
    return `Create an engaging and interactive course structure for:
Topic: ${input.topic}
Category: ${input.category}
Level: ${input.level}
Duration: ${input.duration}
Number of Chapters: ${input.noOfChapters}

Include:
1. Engaging emojis for each section
2. Clear learning objectives
3. Practical examples and exercises
4. Interactive elements
5. Knowledge checks
6. Real-world applications

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
};

export const formatDuration = (duration) => {
    const [min, max] = duration.split('-').map(Number);
    return `${min}-${max} hours`;
};

export const getProgressPercentage = (current, total) => {
    return Math.round((current / total) * 100);
};