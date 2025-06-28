// import { Handle, Position } from '@xyflow/react'
// import { Link } from 'lucide-react'
// import React from 'react'

// function TurboNode({data}:any) {
//   return (
//     <div className='rounded-lg border-gray-300 bg-yellow-100 shadow-md w-64 p-5'>

//       <div className='font-bold text-lg text-gray-800'>{data.title}</div>

//       <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{data.description}</p>

//       <Link href={data?.Link} target='_blank' className='text-blue-600 underLine text-sm mt-2 inline-block'>
//       Learn More
//       </Link>

//       <Handle type='target' position={Position.Top}/>
//       <Handle type='source' position={Position.Bottom}/>
//     </div>
//   )
// }

// export default TurboNode




import React from 'react';

function TurboNode({ data }: any) {
  return (
    <div className="p-4 w-full max-w-xs rounded-xl shadow-lg bg-gradient-to-br from-indigo-100 to-indigo-50 border-2 border-indigo-300">
      <h4 className="font-bold text-indigo-700 text-lg">{data.title}</h4>
      <p className="text-sm text-gray-700 mt-2">{data.description}</p>
      {data.link && (
        <a
          href={data.link}
          className="text-indigo-600 underline text-sm mt-3 inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </a>
      )}
    </div>
  );
}

export default TurboNode;
