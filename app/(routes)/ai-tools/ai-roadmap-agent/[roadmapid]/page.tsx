
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import RoadmapCanvas from './_components/RoadmapCanvas';
import RoadmapGeneratorDialog from '@/app/(routes)/dashboard/_components/RoadmapGeneratorDialog';

function RoadmapGeneratorAgent() {
  const { roadmapid } = useParams();
  const [roadMapDetail, setRoadMapDetail] = useState<any>();
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);

  useEffect(() => {
    roadmapid && GetRoadmapDetails();
  }, [roadmapid]);

  const GetRoadmapDetails = async () => {
    const result = await axios.get('/api/history?recordId=' + roadmapid);
    const content = result.data?.content;

    // Force all nodes to use the custom TurboNode type
    const patchedNodes = content?.initialNodes?.map((node: any) => ({
      ...node,
      type: 'turbo',
    }));

    setRoadMapDetail({
      ...content,
      initialNodes: patchedNodes,
    });
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
      <div className='border rounded-xl p-5'>
        <h2 className='font-bold text-2xl'>{roadMapDetail?.roadmapTitle}</h2>
        <p className='mt-3 text-gray-500'>
          <strong>Description:</strong><br />
          {roadMapDetail?.description}
        </p>
        <h2 className='mt-5 font-medium text-blue-600'>
          Duration: {roadMapDetail?.duration}
        </h2>
        <Button onClick={()=> setOpenRoadmapDialog(true)} className='mt-5 w-full'>Create Another Roadmap</Button>
      </div>

      <div className='md:col-span-2 w-full h-[80vh]'>
        {roadMapDetail?.initialNodes && roadMapDetail?.initialEdges && (
          <RoadmapCanvas
            initialNodes={roadMapDetail.initialNodes}
            initialEdges={roadMapDetail.initialEdges}
          />
        )}
      </div>

      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={()=> setOpenRoadmapDialog(false)} 
      />
    </div>
  );
}

export default RoadmapGeneratorAgent;
