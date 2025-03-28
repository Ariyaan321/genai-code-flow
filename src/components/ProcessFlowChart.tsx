import React, { useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ProcessFlow } from '../types';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

interface ProcessFlowChartProps {
  data: ProcessFlow;
}

export default function ProcessFlowChart({ data }: ProcessFlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const initialNodes: Node[] = useMemo(() => {
    const nodesArray: Node[] = [];
    const verticalGap = 300; // Increased from 200
    const horizontalGap = 600; // Increased from 400
    
    data.phases.forEach((phase, phaseIndex) => {
      // Main phase node
      const phaseNode: Node = {
        id: `phase-${phaseIndex}`,
        type: 'custom',
        position: { x: 50, y: phaseIndex * verticalGap + 50 }, // Added offset
        data: {
          label: phase.phase,
          description: phase.description,
          code: phase.code,
          isExpanded: false,
          onToggle: () => {
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === `phase-${phaseIndex}`) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      isExpanded: !node.data.isExpanded,
                    },
                  };
                }
                return node;
              })
            );
          },
        },
      };
      nodesArray.push(phaseNode);

      // Description node
      const descriptionNode: Node = {
        id: `description-${phaseIndex}`,
        type: 'custom',
        position: { x: horizontalGap, y: phaseIndex * verticalGap + 50 }, // Added offset
        data: {
          label: 'Description',
          description: phase.description,
          isExpanded: false,
        },
      };
      nodesArray.push(descriptionNode);

      // Code snippets node
      const codeNode: Node = {
        id: `code-${phaseIndex}`,
        type: 'custom',
        position: { x: horizontalGap * 2, y: phaseIndex * verticalGap + 50 }, // Added offset
        data: {
          label: 'Code Snippets',
          description: 'Implementation details',
          code: phase.code,
          isExpanded: false,
          onToggle: () => {
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === `code-${phaseIndex}`) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      isExpanded: !node.data.isExpanded,
                    },
                  };
                }
                return node;
              })
            );
          },
        },
      };
      nodesArray.push(codeNode);

      // Add sub-phase nodes if they exist
      if (phase.sub_phases) {
        phase.sub_phases.forEach((subPhase, subIndex) => {
          const subPhaseNode: Node = {
            id: `phase-${phaseIndex}-sub-${subIndex}`,
            type: 'custom',
            position: {
              x: horizontalGap / 2,
              y: phaseIndex * verticalGap + (subIndex + 1) * 150 + 50, // Increased gap and added offset
            },
            data: {
              label: subPhase.sub_phase,
              description: subPhase.description,
              code: subPhase.code,
              isExpanded: false,
              onToggle: () => {
                setNodes((nds) =>
                  nds.map((node) => {
                    if (node.id === `phase-${phaseIndex}-sub-${subIndex}`) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          isExpanded: !node.data.isExpanded,
                        },
                      };
                    }
                    return node;
                  })
                );
              },
            },
          };
          nodesArray.push(subPhaseNode);
        });
      }
    });

    return nodesArray;
  }, [data]);

  const initialEdges: Edge[] = useMemo(() => {
    const edgesArray: Edge[] = [];

    data.phases.forEach((phase, phaseIndex) => {
      // Connect phase to description
      edgesArray.push({
        id: `edge-phase-${phaseIndex}-description`,
        source: `phase-${phaseIndex}`,
        target: `description-${phaseIndex}`,
        type: 'smoothstep',
        animated: true,
      });

      // Connect description to code
      edgesArray.push({
        id: `edge-description-${phaseIndex}-code`,
        source: `description-${phaseIndex}`,
        target: `code-${phaseIndex}`,
        type: 'smoothstep',
        animated: true,
      });

      // Connect to next phase
      if (phaseIndex < data.phases.length - 1) {
        edgesArray.push({
          id: `edge-phase-${phaseIndex}-to-${phaseIndex + 1}`,
          source: `phase-${phaseIndex}`,
          target: `phase-${phaseIndex + 1}`,
          type: 'smoothstep',
          animated: true,
        });
      }

      // Connect sub-phases
      if (phase.sub_phases) {
        phase.sub_phases.forEach((_, subIndex) => {
          edgesArray.push({
            id: `edge-${phaseIndex}-${subIndex}`,
            source: `phase-${phaseIndex}`,
            target: `phase-${phaseIndex}-sub-${subIndex}`,
            type: 'smoothstep',
            animated: true,
          });
        });
      }
    });

    return edgesArray;
  }, [data]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [data, initialNodes, initialEdges]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }} // Increased padding
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}