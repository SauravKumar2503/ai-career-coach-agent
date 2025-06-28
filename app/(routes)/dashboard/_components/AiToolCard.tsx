
// "use client";
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';
// import ResumeUploadDialog from './ResumeUploadDialog';

// interface TOOL {
//   name: string;
//   desc: string;
//   icon: string;
//   button: string;
//   path: string;
// }

// type AIToolProps = {
//   tool: TOOL;
// };

// function AiToolCard({ tool }: AIToolProps) {
//   const [id, setId] = useState<string>('');
//   const { user } = useUser();
//   const router = useRouter();
//   const [openResumeUpload,setOpenResumeUpload]=useState(false);

//   useEffect(() => {
//     setId(uuidv4());
//   }, []);

//   const onClickButton = async () => {

//     if(tool.name == 'AI Resume Analyzer'){
//       setOpenResumeUpload(true);
//       return;
//     }


//     const result = await axios.post('/api/history', {
//       recordId: id,
//       content: [],
//       aiAgentType: tool.path
//     });
//     console.log(result);
//     router.push(tool.path + '/' + id);
//   };

//   // Don’t render until UUID is set (avoids hydration mismatch)
//   if (!id) return null;

//   return (
//     <div className='p-3 border rounded-lg'>
//       <Image src={tool.icon} width={40} height={40} alt={tool.name} />
//       <h2 className='font-bold mt-2'>{tool.name}</h2>
//       <p className='text-gray-400'>{tool.desc}</p>

//       {/* Change from <Link> to a Button that handles routing */}
//       <Button className='w-full mt-3' onClick={onClickButton}>
//         {tool.button}
//       </Button>

//       <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={setOpenResumeUpload}/>
//     </div>
//   );
// }

// export default AiToolCard;









"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import ResumeUploadDialog from './ResumeUploadDialog';
import RoadmapGeneratorDialog from './RoadmapGeneratorDialog';

interface TOOL {
  name: string;
  desc: string;
  icon: string;
  button: string;
  path: string;
}

type AIToolProps = {
  tool: TOOL;
};

function AiToolCard({ tool }: AIToolProps) {
  const [id, setId] = useState<string>('');
  const { user } = useUser();
  const router = useRouter();
  const [openResumeUpload,setOpenResumeUpload]=useState(false);

  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);

  useEffect(() => {
    setId(uuidv4());
  }, []);

  const onClickButton = async () => {

    if(tool.name == 'AI Resume Analyzer'){
      setOpenResumeUpload(true);
      return;
    }

    if(tool.path == '/ai-tools/ai-roadmap-agent')
    {
      setOpenRoadmapDialog(true);
      return;
    }

    const result = await axios.post('/api/history', {
      recordId: id,
      content: [],
      aiAgentType: tool.path
    });
    console.log(result);
    router.push(tool.path + '/' + id);
  };

  // Don’t render until UUID is set (avoids hydration mismatch)
  if (!id) return null;

  return (
    <div className='p-3 border rounded-lg'>
      <Image src={tool.icon} width={40} height={40} alt={tool.name} />
      <h2 className='font-bold mt-2'>{tool.name}</h2>
      <p className='text-gray-400'>{tool.desc}</p>

      {/* Change from <Link> to a Button that handles routing */}
      <Button className='w-full mt-3' onClick={onClickButton}>
        {tool.button}
      </Button>

      <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={setOpenResumeUpload}/>

      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={() => setOpenRoadmapDialog(false)}
      />
    </div>
  );
}

export default AiToolCard;
 