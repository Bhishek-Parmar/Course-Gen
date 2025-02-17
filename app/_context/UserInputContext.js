// "use client"
// import { createContext } from "react";

// export const UserInputContext = createContext();
// ---------------------------------------------------------------old code above--------------------------------------------------------------------    

// _context/UserInputContext.js
"use client";
import { createContext, useState } from 'react';

export const UserInputContext = createContext();

export const UserInputProvider = ({ children }) => {
    const [userCourseInput, setUserCourseInput] = useState({
        category: '',
        topic: '',
        description: '',
        level: '',
        duration: '',
        noOfChapters: 5,
        displayVideo: true,
        generatedContent: null,
        lastUpdated: null
    });

    const resetCourseInput = () => {
        setUserCourseInput({
            category: '',
            topic: '',
            description: '',
            level: '',
            duration: '',
            noOfChapters: 5,
            displayVideo: true,
            generatedContent: null,
            lastUpdated: null
        });
    };

    const updateCourseInput = (updates) => {
        setUserCourseInput(prev => ({
            ...prev,
            ...updates,
            lastUpdated: new Date().toISOString()
        }));
    };

    return (
        <UserInputContext.Provider value={{
            userCourseInput,
            setUserCourseInput,
            resetCourseInput,
            updateCourseInput
        }}>
            {children}
        </UserInputContext.Provider>
    );
};