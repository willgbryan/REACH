import React, { useCallback, MouseEvent } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  ConnectionMode,
  Connection,
  useReactFlow,
  ReactFlowProvider,
  NodeDragHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './node-style.css';

import DrawerOnClick from '@/components/ui/on-click-drawer';
import { useDrawer } from '@/components/ui/DrawerContext';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const edgeTypes = {};
const nodeTypes = {};

interface EdgesFlowProps {
  onAdd?: () => void;
}

const EdgesFlow: React.FC<EdgesFlowProps> = ({ onAdd }) => {
  const { selectedDataSource } = useDrawer();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getIntersectingNodes } = useReactFlow();

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleAddNode = useCallback(() => {
    let newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label: `Added node: ${selectedDataSource}` },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };

    if (selectedDataSource === 'input') {
      newNode = {
        ...newNode,
        type: 'input',
        style: { background: '#e3f2fd', border: '1px solid #90caf9' },
      };
    } else if (selectedDataSource === 'action') {
      newNode = {
        ...newNode,
        style: { background: '#fce4ec', border: '1px solid #f48fb1' },
      };
    } else if (selectedDataSource === 'output') {
      newNode = {
        ...newNode,
        style: { background: '#e8f5e9', border: '1px solid #a5d6a7' },
      };
    }

    setNodes((nds) => nds.concat(newNode));
    if (onAdd) {
      onAdd();
    }
  }, [nodes, setNodes, onAdd, selectedDataSource]);

  const onNodeDrag: NodeDragHandler = useCallback((event, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? 'highlight' : '',
      }))
    );
  }, [getIntersectingNodes, setNodes]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        // className="intersection-flow"
        // snapToGrid={true}
        // snapGrid={[20, 20]}
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

export default function App() {
  return (
    <ReactFlowProvider>
      <EdgesFlow />
    </ReactFlowProvider>
  );
}
