import React from 'react';
import { HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi2";
import EditChapters from './EditChapters';
import { motion } from "framer-motion";

function ChapterList({ course, refreshData, edit = true }) {
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
        📚 Course Chapters
      </h2>
      <div className="mt-6 space-y-6">
        {course?.courseOutput?.course?.chapters?.map((chapter, index) => (
          <motion.div
            key={`chapter-${index}`}
            className="relative group p-6 rounded-2xl bg-white/80 backdrop-blur-lg shadow-md border border-gray-200 
                       transition-all hover:shadow-lg hover:scale-[1.01] flex items-start gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Chapter Number */}
            <div className="bg-gradient-to-br from-primary to-purple-500 h-14 w-14 text-white rounded-full 
                            flex items-center justify-center text-lg font-extrabold shadow-md">
              {index + 1}
            </div>

            {/* Chapter Content */}
            <div className="flex-grow">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                {chapter?.name}
                {edit && <EditChapters course={course} index={index} refreshData={refreshData} />}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{chapter?.about}</p>

              {/* Meta Information */}
              <div className="flex gap-6 text-sm text-primary items-center mt-3">
                <span className="flex items-center gap-2 text-gray-700">
                  <HiOutlineClock className="text-lg text-gray-500" />
                  {chapter?.duration}
                </span>
                {chapter?.keyTakeaways?.length > 0 && (
                  <span className="text-gray-500">
                    {chapter?.keyTakeaways?.length} Key Takeaways
                  </span>
                )}
              </div>
            </div>

            {/* Status Icon */}
            {chapter?.completed && (
              <motion.div
                className="absolute top-3 right-3 text-green-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <HiOutlineCheckCircle className="text-2xl" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
