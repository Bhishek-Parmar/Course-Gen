import React from 'react'
import { HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi2";
import EditChapters from './EditChapters';
function ChapterList({course, refreshData, edit=true}) {
  return (
    <div className='mt-3'>
        <h2 className='font-medium text-xl'>📚 Course Chapters</h2>
        <div className='mt-2'>
            {course?.courseOutput?.course?.chapters?.map((chapter,index)=>(
               <div key={`chapter-${index}`} 
                    className='border p-5 rounded-lg mb-2 hover:border-primary transition-all'>
                <div className='flex gap-5 items-center'>
                        <h2 className='bg-primary flex-none h-12 w-12 text-white rounded-full 
                                     flex items-center justify-center text-lg font-medium'>
                            {index+1}
                        </h2>
                        <div className='flex-grow'>
                            <h2 className='font-medium text-lg flex items-center gap-2'>
                                {chapter?.name}
                                {edit && <EditChapters course={course} index={index} refreshData={refreshData} />}
                            </h2>
                            <p className='text-sm text-gray-500'>{chapter?.about}</p>
                            <div className='flex gap-4 text-sm text-primary items-center mt-2'>
                                <span className='flex items-center gap-1'>
                                    <HiOutlineClock className='text-lg'/> 
                                    {chapter?.duration}
                                </span>
                                {chapter?.keyTakeaways?.length > 0 && (
                                    <span className='text-gray-500'>
                                        {chapter?.keyTakeaways?.length} key takeaways
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ChapterList