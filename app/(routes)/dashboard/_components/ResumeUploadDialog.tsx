
import React, { useState } from 'react';
import { File, Loader2Icon, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { set } from 'zod';
import { useAuth } from '@clerk/nextjs';

function ResumeUploadDialog({ openResumeUpload, setOpenResumeDialog }: any) {

  const [file, setFile] = useState<File | null>(null);
  const [loading,setLoading] = useState(false);
  const router = useRouter();
  const {has} = useAuth();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile.name);
    }
  };

  const onUplaodAndAnalyze=async()=>{
    setLoading(true);
    if (!file) return;
    const recordId=uuidv4();
    const formData = new FormData();
    formData.append('recordId',recordId);
    formData.append('resumeFile',file);
    //formData.append('aiAgentType','/ai-tools/ai-resume-analyzer');

    //@ts-ignore
    const hasSubscriptionEnabled = await has({plan: 'pro'});
    if(!hasSubscriptionEnabled)
    {
       const resultHistory = await axios.get('/api/history');
       const historyList = resultHistory.data;
       const isPresent = await historyList.find((item:any)=> item?.aiAgentTypr =='/ai-tools/ai-resume-analyzer')
       router.push('/billing');
       if(isPresent){
        return null;
       }
    }

    //Send FormData to the Backend server
    const result = await axios.post('/api/ai-resume-agent',formData)
    console.log(result.data);
    setLoading(false);
    router.push('/ai-tools/ai-resume-analyzer/'+ recordId)
    setOpenResumeDialog(false);
  }

  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload resume pdf file</DialogTitle>
          <DialogDescription>
            Please upload your PDF resume below.
          </DialogDescription>
        </DialogHeader>

        <div>
          <label
            htmlFor='resumeUpload'
            className='flex items-center flex-col justify-center p-7 border border-dashed rounded-xl hover:bg-slate-100 cursor-pointer'
          >
            <File className='h-10 w-10' />
            {file ? (
              <>
                <h2 className='mt-3 text-blue-600'>{file.name}</h2>
                <h2 className='mt-3'>Click here to Upload PDF file</h2>
              </>
            ) : (
              <h2 className='mt-3'>Click here to Upload PDF file</h2>
            )}
          </label>
          <input
            type='file'
            id='resumeUpload'
            accept="application/pdf"
            className='hidden'
            onChange={onFileChange}
          />
        </div>

        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpenResumeDialog(false)}>Cancel</Button>
          <Button disabled={!file || loading} onClick={onUplaodAndAnalyze}>
            {loading? <Loader2Icon className='animate-spin'/> :
            <Sparkles className="mr-2" />} Upload & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeUploadDialog;









