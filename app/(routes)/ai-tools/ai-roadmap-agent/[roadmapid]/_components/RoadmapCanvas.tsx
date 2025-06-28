// import React from 'react'
// import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';

// import '@xyflow/react/dist/style.css';
// import TurboNode from './TurboNode';

// const nodeTypes = {
//   turbo:TurboNode
// } 


// function RoadmapCanvas({initialNodes,initialEdges}:any) {
//   return (
//     <div style={{ width: '100%', height: '100%'}}>
//       <ReactFlow nodes={initialNodes} edges={initialEdges} nodeTypes={nodeTypes}>
//         <Controls/>
//         <MiniMap/>
//         {/*@ts-ignore*/}
//         <Background variant="dots" gap={12} size={1}/>
//       </ReactFlow>
//     </div>
//   )
// }

// export default RoadmapCanvas




'use client';
import React from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';

const nodeTypes = {
  turbo: TurboNode,
};

function RoadmapCanvas({ initialNodes = [], initialEdges = [] }: any) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 1 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
          },
          style: {
            stroke: '#6366f1',
            strokeWidth: 2.5,
          },
        }}
      >
        <Controls />
        <MiniMap nodeColor={() => '#6366f1'} />
        <Background gap={20} size={1.2} color="#e5e7eb" />
      </ReactFlow>
    </div>
  );
}

export default RoadmapCanvas;

