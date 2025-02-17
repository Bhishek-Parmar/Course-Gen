"use client";
import React from 'react';
import { motion } from 'framer-motion';

function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -right-10 -top-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -left-10 -bottom-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create Amazing
            <span className="block mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered Courses
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Transform your knowledge into engaging courses in seconds with our AI technology.
            No coding required, just your imagination.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 rounded-full
                       bg-gradient-to-r from-purple-600 to-pink-600
                       text-white font-medium text-lg
                       transform hover:scale-105 transition-all
                       hover:shadow-lg hover:shadow-purple-500/30"
            >
              Start Creating
              <motion.svg
                className="ml-2 w-6 h-6"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </motion.svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              icon: "🎨",
              title: "AI-Powered Design",
              description: "Beautiful course layouts created automatically"
            },
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "Generate complete courses in seconds"
            },
            {
              icon: "🔄",
              title: "Easy Updates",
              description: "Modify content with one click"
            },
            {
              icon: "📱",
              title: "Mobile Ready",
              description: "Courses look great on all devices"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl
                         hover:shadow-2xl transition-all duration-300
                         border border-purple-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: "1000+", label: "Courses Created" },
            { number: "50k+", label: "Happy Students" },
            { number: "99%", label: "Satisfaction Rate" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-4"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div> */}
      </div>
    </div>
  );
}

export default Hero;