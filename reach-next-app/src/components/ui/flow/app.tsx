import React, { useCallback, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Position,
  ConnectionMode,
  MarkerType,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import DrawerOnClick from '@/components/ui/on-click-drawer';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const edgeTypes = {};
const nodeTypes = {};

const EdgesFlow = ({ isDrawerOpen, setIsDrawerOpen, onAdd }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleAddNode = useCallback(() => {
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: 'Added node' },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => {
      const updatedNodes = nds.concat(newNode);
      return updatedNodes;
    });
    if (onAdd) {
      onAdd();
    }
  }, [nodes, setNodes, onAdd]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        snapToGrid={true}
        snapGrid={[20, 20]}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        connectionMode={ConnectionMode.Loose}
      >
        <Controls />
        <Background />
        <MiniMap />
      </ReactFlow>
      <DrawerOnClick 
        isOpen={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
        onFileUpload={(selectedDataSource) => console.log(`File uploaded: ${selectedDataSource}`)}
        onAdd={handleAddNode}
      />
    </>
  );
};

export default EdgesFlow;
