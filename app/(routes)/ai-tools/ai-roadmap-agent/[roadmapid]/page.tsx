// "use client"
// import React from 'react'
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import RoadmapCanvas from './_components/RoadmapCanvas';

// function RoadmapGeneratorAgent() {
//   const { roadmapid } = useParams();
//   const [roadMapDetail,setRoadMapDetail] = useState<any>();

//   useEffect(() => {
//     roadmapid && GetRoadmapDetails();
//   },[roadmapid]);


//   const GetRoadmapDetails =async() =>{
//     const result = await axios.get('/api/history?recordId=' + roadmapid);
//     console.log(result.data);
//     setRoadMapDetail(result.data?.content);
//   }

  

//   return (
//     <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
//       <div className='border rounded-xl p-5'>
//           <h2 className='font-bold text-2xl'>{roadMapDetail?.roadmapTitle}</h2>

//           <p className='mt-3 text-gray-500'><strong>Description:</strong><br></br>{roadMapDetail?.description}</p>

//           <h2 className='mt-5 font-medium text-blue-600'>Duration: {roadMapDetail?.duration}</h2>

//           <Button className='mt-5 w-full'>+ Create Another Roadmap</Button>
//       </div>
//       <div className='md:col-span-2 w-full h-[80vh]'>
//         <RoadmapCanvas initialNodes={roadMapDetail?.initialNodes} initialEdges={roadMapDetail?.initialEdges}/>
//       </div>
//     </div>
//   )
// }

// export default RoadmapGeneratorAgent




"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import RoadmapCanvas from "./_components/RoadmapCanvas";
import RoadmapGeneratorDialog from "@/app/(routes)/dashboard/_components/RoadmapGeneratorDialog";

function RoadmapGeneratorAgent() {
  const { roadmapid } = useParams();
  const [roadMapDetail, setRoadMapDetail] = useState<any>(null);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);

  useEffect(() => {
    roadmapid && GetRoadmapDetails();
  }, [roadmapid]);

  const GetRoadmapDetails = async () => {
    const result = await axios.get("/api/history?recordId=" + roadmapid);
    const content = result.data?.content;

    // ✅ Transform all node types to 'turbo'
    const transformedNodes = content.initialNodes.map((node: any) => ({
      ...node,
      type: "turbo",
    }));

    setRoadMapDetail({
      ...content,
      initialNodes: transformedNodes,
    });

    console.log("Updated roadmap content:", {
      ...content,
      initialNodes: transformedNodes,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="border rounded-xl p-5">
        <h2 className="font-bold text-2xl">{roadMapDetail?.roadmapTitle}</h2>
        <p className="mt-3 text-gray-500">
          <strong>Description:</strong>
          <br />
          {roadMapDetail?.description}
        </p>
        <h2 className="mt-5 font-medium text-blue-600">
          Duration: {roadMapDetail?.duration}
        </h2>
        <Button
          onClick={() => setOpenRoadmapDialog(true)}
          className="mt-5 w-full"
        >
          + Create Another Roadmap
        </Button>
      </div>

      <div className="md:col-span-2 w-full h-[80vh]">
        {roadMapDetail?.initialNodes?.length ? (
          <RoadmapCanvas
            initialNodes={roadMapDetail.initialNodes}
            initialEdges={roadMapDetail.initialEdges}
          />
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Loading chart...
          </div>
        )}
      </div>
      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={() => setOpenRoadmapDialog(false)}
      />
    </div>
  );
}

export default RoadmapGeneratorAgent;
