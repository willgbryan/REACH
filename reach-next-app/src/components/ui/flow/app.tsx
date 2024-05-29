import React, { useCallback } from 'react';
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
import { useDrawer } from '@/components/ui/DrawerContext';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const edgeTypes = {};
const nodeTypes = {};

const EdgesFlow = ({ onAdd }) => {
  const { isDrawerOpen, setIsDrawerOpen, selectedDataSource } = useDrawer();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleAddNode = useCallback(() => {
    let style = {};
    if (selectedDataSource === 'input') {
      style = { background: '#e3f2fd', border: '1px solid #90caf9' };
    } else if (selectedDataSource === 'action') {
      style = { background: '#fce4ec', border: '1px solid #f48fb1' };
    } else if (selectedDataSource === 'output') {
      style = { background: '#e8f5e9', border: '1px solid #a5d6a7' };
    }

    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: selectedDataSource ? `Added node: ${selectedDataSource}` : 'Added node' },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
      style,
    };
    setNodes((nds) => nds.concat(newNode));
    if (onAdd) {
      onAdd();
    }
  }, [nodes, setNodes, onAdd, selectedDataSource]);

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
      <DrawerOnClick onFileUpload={(selectedDataSource) => console.log(`File uploaded: ${selectedDataSource}`)} onAdd={handleAddNode} />
    </>
  );
};

export default EdgesFlow;
