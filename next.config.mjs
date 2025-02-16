/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com', 'img.clerk.com'],
    },
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    },
};

export default nextConfig;
