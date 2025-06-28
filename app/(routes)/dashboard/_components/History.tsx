// "use client"
// import React from 'react'
// import { useState } from 'react'
// import Image from 'next/image'

// function History() {

//   const [userHistory, setUserHistory] = useState([]);

//   return (
//     <div className='mt-5 p-5 border rounded-xl' >
//       <h2 className='font-bold text-lg'>Previous History</h2>

//       <p>What Your previously work on, You can find here</p>

//       {history?.length == 0 &&

//         <div>
//           <Image src = {'/idea.png'} alt ='bulb'
//           width={50} height={50}/>
//       }
//     </div>
//   )
// }

// export default History;

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { aiToolsList } from "./AiToolsList";
import { Skeleton } from "@/components/ui/skeleton";

function History() {
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetHistory();
  }, []);

  const GetHistory = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/history");
      console.log(result.data);
      setUserHistory(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const GetAgentName = (path: string) => {
    const agent = aiToolsList.find((item) => item.path === path);
    return agent;
  };

  return (
    <div className="mt-5 p-5 border rounded-xl">
      <h2 className="font-bold text-lg">Previous History</h2>
      <p>What you previously worked on, you can find here</p>

      {loading && (
        <div>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div key={index}>
              <Skeleton className="h-[50px] mt-4 w-full rounded-md" />
            </div>
          ))}
        </div>
      )}

      {userHistory.length === 0 && !loading ? (
        <div className="mt-6 flex items-center justify-center flex-col">
          <Image src="/idea.png" alt="bulb" width={50} height={50} />
          <h2>You do not have any history</h2>
          <Button className="mt-5">Explore AI Tools</Button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {userHistory.map((history: any, index: number) => {
            const agent = GetAgentName(history?.aiAgentType);
            return (
              <Link
                key={index}
                href={`${history?.aiAgentType}/${history?.recordId}`}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={agent?.icon || "/default-icon.png"}
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                  <h2 className="text-md font-medium text-gray-700">
                    {agent?.name}
                  </h2>
                </div>
                <h2 className="text-sm text-gray-500">
                  {new Date(history.createdAt).toLocaleString()}
                </h2>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default History;
