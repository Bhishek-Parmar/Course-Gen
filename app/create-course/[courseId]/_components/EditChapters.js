import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiPencilSquare } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";

const EditChapters = ({course, index, refreshData}) => {
    const Chapters = course?.courseOutput?.course.chapters;
    const [name, setName] = useState(Chapters?.[index]?.name || '');
    const [about, setAbout] = useState(Chapters?.[index]?.about || '');

    const onUpdateHandler = async () => {
        if (!Chapters?.[index]) return;
        
        const updatedChapters = [...Chapters];
        updatedChapters[index] = {
            ...updatedChapters[index],
            name,
            about
        };
        
        try {
            await db.update(CourseList)
                .set({
                    courseOutput: {
                        ...course.courseOutput,
                        course: {
                            ...course.courseOutput.course,
                            chapters: updatedChapters
                        }
                    }
                })
                .where(eq(CourseList.id, course?.id));
            
            refreshData();
        } catch (error) {
            console.error('Failed to update chapter:', error);
        }
    }

  return (
    <div>
      <Dialog>
        <DialogTrigger><HiPencilSquare /></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
            <div className='mt-3'>
                <label>Course Title</label>
                <Input defaultValue={Chapters[index].name}
                onChange={(event)=>setName(event?.target.value)}
                />
            </div>
            <div>
                <label>Description</label>
                <Textarea className="h-40" 
                defaultValue={Chapters[index].about}
                onChange={(event)=>setAbout(event?.target.value)}
                />
            </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
                <Button onClick={onUpdateHandler}>Update</Button>
            </DialogClose>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditChapters;
