
// import React from 'react';
// import Link from 'next/link';
// import { Handle, Position } from '@xyflow/react';

// function TurboNode({ data }: any) {
//   return (
//     <div className="rounded-lg border border-gray-300 bg-yellow-200 shadow-md w-64 p-4">
//       <div className="font-bold text-lg text-gray-800">{data.title}</div>
//       <p className="text-sm text-gray-600 mt-1 line-clamp-2">{data.description}</p>

//       <Link
//         href={data?.link || '#'}
//         className="text-blue-600 underline text-sm mt-2 inline-block"
//         target="_blank"
//       >
//         Learn More
//       </Link>

//       <Handle type="target" position={Position.Top} />
//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// }

// export default TurboNode;







import React from 'react';
import Link from 'next/link';
import { Handle, Position } from '@xyflow/react';

function TurboNode({ data }: any) {
  return (
    <div className='rounded-xl border border-gray-300 bg-yellow-100 shadow-md w-72 px-5 py-4 transition-transform duration-200 hover:scale-[1.03]'>
      <div className='font-bold text-base text-gray-900'>{data.title}</div>
      <p className='text-sm text-gray-700 mt-2 line-clamp-3'>{data.description}</p>

      {data?.link && (
        <Link
          href={data.link}
          target='_blank'
          className='text-blue-600 underline text-sm mt-2 inline-block'
        >
          Learn More
        </Link>
      )}

      <Handle type='target' position={Position.Top} className='!bg-gray-500' />
      <Handle type='source' position={Position.Bottom} className='!bg-gray-500' />
    </div>
  );
}

export default TurboNode;
