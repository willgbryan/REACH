import React, { useCallback, useEffect, useState } from 'react';
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

interface JsonObject {
    nodes: {
      id: string;
      type?: string;
      position: { x: number; y: number };
      data: any;
    }[];
    edges: {
      id: string;
      source: string;
      target: string;
      type?: string;
    }[];
}

const EdgesFlow: React.FC<EdgesFlowProps> = ({ onAdd }) => {
    const { selectedDataSource } = useDrawer();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { getIntersectingNodes } = useReactFlow();
    const [jsonObject, setJsonObject] = useState<JsonObject>({ nodes: [], edges: [] });
    
    const generateJson = (nodes: Node[], edges: Edge[]) => {
        return {
          nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data,
          })),
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
          })),
        };
      };

    const onConnect = useCallback((params: Edge | Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        const jsonObject = generateJson(nodes, newEdges);
        setJsonObject(jsonObject)
        console.log(`Produced json on edge: ${JSON.stringify(jsonObject, null, 2)}`);
        return newEdges;
      });
    }, [nodes, setEdges]);
  
    const handleAddNode = useCallback(() => {
      let newNode: Node = {
        id: `${nodes.length + 1}`,
        data: { label: `Added node: ${selectedDataSource}` },
        position: {
          x: Math.random() * window.innerWidth - 100,
          y: Math.random() * window.innerHeight,
        },
      };
  
      if (selectedDataSource === 'Files') {
        newNode = {
          ...newNode,
          type: 'input',
          style: { background: '#e3f2fd', border: '1px solid #90caf9' },
        };
      } else if (selectedDataSource === 'Systems') {
        newNode = {
          ...newNode,
          style: { background: '#fce4ec', border: '1px solid #f48fb1' },
        };
      } else if (selectedDataSource === 'Internet') {
        newNode = {
          ...newNode,
          style: { background: '#e8f5e9', border: '1px solid #a5d6a7' },
        };
      }
  
      const updatedNodes = nodes.concat(newNode);
      setNodes(updatedNodes);
      const jsonObject = generateJson(updatedNodes, edges);
      setJsonObject(jsonObject);
      console.log(`Produced json on node: ${JSON.stringify(jsonObject, null, 2)}`);
      if (onAdd) {
        onAdd();
      }
    }, [nodes, edges, setNodes, onAdd, selectedDataSource]);
  
    const onNodeDrag: NodeDragHandler = useCallback((event, node) => {
      const intersections = getIntersectingNodes(node).map((n) => n.id);
  
      setNodes((ns) => {
        const updatedNodes = ns.map((n) => ({
          ...n,
          className: intersections.includes(n.id) ? 'highlight' : '',
        }));
        setJsonObject(generateJson(updatedNodes, edges));
        return updatedNodes;
      });
    }, [getIntersectingNodes, setNodes, edges]);
  
    useEffect(() => {
      setJsonObject(generateJson(nodes, edges));
    }, [nodes, edges]);
  
    return (
      <>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
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
        <DrawerOnClick onFileUpload={handleAddNode} onAdd={handleAddNode} />
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
