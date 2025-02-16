import React from 'react'
import { HiOutlineClock } from "react-icons/hi2";

function ChapterListCard({ chapter, index, onRegenerate }) {
    return (
        <div className="p-4 flex justify-between items-center">
            <div>
                <h3 className="font-medium">{chapter.name}</h3>
                <p className="text-sm text-gray-500">{chapter.duration}</p>
            </div>
            {onRegenerate && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRegenerate(index);
                    }}
                    className="p-2 hover:bg-primary/10 rounded-full"
                >
                    🔄
                </button>
            )}
        </div>
    );
}

export default ChapterListCard