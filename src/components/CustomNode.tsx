import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Code } from 'lucide-react';

interface CustomNodeData {
  label: string;
  description: string;
  code?: string[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

const CustomNode = memo(({ data }: NodeProps<CustomNodeData>) => {
  const { label, description, code, isExpanded, onToggle } = data;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 min-w-[250px] max-w-[400px]">
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        {code && code.length > 0 && onToggle && (
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      
      {isExpanded && code && code.length > 0 && (
        <div className="mt-3 space-y-2">
          {code.map((snippet, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded-md">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Code className="w-4 h-4" />
                <span className="text-xs">Snippet {index + 1}</span>
              </div>
              <pre className="text-xs overflow-x-auto">
                <code>{snippet}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
      
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;