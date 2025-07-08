
// import React from "react";
// import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";

// import "@xyflow/react/dist/style.css";
// import TurboNode from "./TurboNode";


// const nodeTypes = {
//   turbo:TurboNode
// }
// function RoadmapCanvas({initialNodes,initialEdges}:any) {
//   // const initialNodes = [
//   //   { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
//   //   { id: "2", position: { x: 100, y: 100 }, data: { label: "2" } },
//   // ];
//   // const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <ReactFlow nodes={initialNodes} edges={initialEdges} nodeTypes = {nodeTypes}
//       >
//         <Controls/>
//         <MiniMap/>
//         {/* @ts-ignore */}
//         <Background variant="dots" gap={12} size={1}/>
//       </ReactFlow>
//     </div>
//   );
// }

// export default RoadmapCanvas;





//Latest working code for RoadmapCanvas component

import React, { useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  MarkerType,
  BackgroundVariant,
  type Node,
  type Edge,
  type Viewport,
  NodeChange,
  applyNodeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TurboNode from "./TurboNode";

const nodeTypes = {
  turbo: TurboNode,
};

function RoadmapCanvas({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  // Zigzag layout: alternate left (x: 0) and right (x: 300)
  const [nodes, setNodes] = useState<Node[]>(
    initialNodes.map((node, index) => ({
      ...node,
      position: {
        x: index % 2 === 0 ? -200 : 200, // alternate left & right
        y: index * 250, // vertical spacing
      },
    }))
  );

  const [edges] = useState<Edge[]>(initialEdges);

  const defaultViewport: Viewport = {
    x: 0,
    y: 0,
    zoom: 1,
  };

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#666",
          },
          style: {
            stroke: "#666",
            strokeWidth: 2,
          },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnScroll
        zoomOnScroll
        defaultViewport={defaultViewport}
      >
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable />
        <Background variant={BackgroundVariant.Lines} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}

export default RoadmapCanvas;
