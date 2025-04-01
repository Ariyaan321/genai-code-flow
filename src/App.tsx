import React, { useState } from 'react';
import ProcessFlowChart from './components/ProcessFlowChart';
import { ProcessFlow } from './types';
import { AlertCircle, Send } from 'lucide-react';

const defaultData: ProcessFlow = {
    phases: [
        {
            phase: "Initialize Project",
            description: "Set up the development environment and project structure",
            code: [
                "npm create vite@latest my-app --template react-ts",
                "cd my-app && npm install"
            ],
            sub_phases: [
                {
                    sub_phase: "Install Dependencies",
                    description: "Install required packages and dependencies",
                    code: [
                        "npm install tailwindcss postcss autoprefixer",
                        "npm install @types/react @types/react-dom"
                    ]
                }
            ]
        }
    ]
};

function App() {
    const [flowData, setFlowData] = useState<ProcessFlow>(defaultData);
    const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultData, null, 2));
    const [jsonError, setJsonError] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    const handleJsonSubmit = () => {
        try {
            const parsedData = JSON.parse(jsonInput);

            // Basic validation of the JSON structure
            if (!parsedData.phases || !Array.isArray(parsedData.phases)) {
                throw new Error('Invalid JSON structure. Must contain a "phases" array.');
            }

            // Validate each phase
            parsedData.phases.forEach((phase: any, index: number) => {
                if (!phase.phase || !phase.description || !Array.isArray(phase.code)) {
                    throw new Error(`Invalid phase structure at index ${index}`);
                }

                if (phase.sub_phases) {
                    if (!Array.isArray(phase.sub_phases)) {
                        throw new Error(`Invalid sub_phases structure at phase ${index}`);
                    }

                    phase.sub_phases.forEach((subPhase: any, subIndex: number) => {
                        if (!subPhase.sub_phase || !subPhase.description || !Array.isArray(subPhase.code)) {
                            throw new Error(`Invalid sub-phase structure at phase ${index}, sub-phase ${subIndex}`);
                        }
                    });
                }
            });

            setFlowData(parsedData);
            setJsonError('');
        } catch (error) {
            setJsonError(error instanceof Error ? error.message : 'Invalid JSON format');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleJsonSubmit();
        }
    };

    return (
        <div className="w-screen h-screen bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Process Flow Visualization</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {isEditing ? 'Hide Editor' : 'Input Code'}
                    </button>
                </div>

                {isEditing && (
                    <div className="mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Write your code here
                                <span className="ml-2 text-gray-500">
                                    (Press Ctrl/Cmd + Enter to submit)
                                </span>
                            </label>
                            <div className="relative">
                                <textarea
                                    className="w-full h-48 p-2 border border-gray-300 rounded-md font-mono text-sm"
                                    placeholder="Paste your code here..."
                                    // value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    onClick={handleJsonSubmit}
                                    className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Submit</span>
                                </button>
                            </div>
                            {jsonError && (
                                <div className="mt-2 text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{jsonError}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 w-full">
                <ProcessFlowChart data={flowData} />
            </div>
        </div>
    );
}

export default App;