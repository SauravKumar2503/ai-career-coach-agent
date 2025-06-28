// "use client"
// import React from 'react'
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import Report from './_components/Report';

// function AiResumeAnalyzer() {
//   const { recordid } = useParams();
//   const [pdfUrl,setPdfUrl] = useState();
//   const [aiReport,setAiReport] = useState();

//   useEffect(() => {
//     recordid && GetResumeAnalyzerRecord();
//   },[recordid]);

//   const GetResumeAnalyzerRecord=async()=>{
//     const result = await axios.get('/api/history?recordId='+ recordid);
//     console.log(result.data);
//     setPdfUrl(result.data?.metaData);
//     setAiReport(result.data?.content);
//   }

//   return (
//     <div className='grid lg:grid-cols-5 grid-cols-1'>
//       <div className='col-span-2'>
//           <Report/>
//       </div>
//       <div className='col-span-3'>
//           <h2 className='font-bold text-2xl mb-5'>Resume Preview</h2>
//           <iframe 
//             src={pdfUrl + '#toolbar=0&navpanes = 0 && scrollbar = 0'}
//             width = {'100%'}
//             height={1200}
//             className='min-2-lg'
//             style={{
//               border:'none',
//             }}
//           />
//       </div>
//     </div>
//   )
// }
 
// export default AiResumeAnalyzer




"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Report from "./_components/Report";

function AiResumeAnalyzer() {
  const { recordid } = useParams();
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();
  const [aiReport, setAiReport] = useState<any>(null);

  useEffect(() => {
    if (recordid) {
      GetResumeAnalyzerRecord();
    }
  }, [recordid]);

  const GetResumeAnalyzerRecord = async () => {
    try {
      const result = await axios.get("/api/history?recordId=" + recordid);
      setPdfUrl(result.data?.metaData);
      setAiReport(result.data?.content);
    } catch (error) {
      console.error("Failed to fetch resume analysis record:", error);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 grid-cols-1 gap-6 px-6 py-6">
      {/* AI Report Panel */}
      <div className="col-span-2">
        <Report data={aiReport} />
      </div>

      {/* PDF Viewer Panel */}
      <div className="col-span-3">
        <h2 className="font-bold text-2xl mb-5">Resume Preview</h2>

        {pdfUrl ? (
          <div className="w-full h-[85vh] overflow-hidden border rounded-lg shadow-md">
            <embed
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width`}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ display: "block", border: "none" }}
            />
          </div>
        ) : (
          <p className="text-gray-500">Loading resume preview...</p>
        )}
      </div>
    </div>
  );
}

export default AiResumeAnalyzer;
