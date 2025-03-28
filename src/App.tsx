import React, { useState } from 'react';
import ProcessFlowChart from './components/ProcessFlowChart';
import { ProcessFlow } from './types';
import { AlertCircle, Send } from 'lucide-react';

const defaultData: ProcessFlow = {
    phases: []
};

function App() {
    const [flowData, setFlowData] = useState<ProcessFlow>(defaultData);
    const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultData, null, 2));
    const [jsonError, setJsonError] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    const handleJsonSubmit = () => {
        try {
            const parsedResponse = JSON.parse(jsonInput);

            let parsedData;
            if (typeof parsedResponse.text === 'string') {
                // Extract JSON from markdown ```json block
                const match = parsedResponse.text.match(/```json\n(.*?)\n```/s);
                parsedData = match ? JSON.parse(match[1]) : JSON.parse(parsedResponse.text);
            } else {
                parsedData = parsedResponse;
            }

            if (!parsedData.phases || !Array.isArray(parsedData.phases)) {
                throw new Error('Invalid JSON structure. Must contain a "phases" array.');
            }

            setFlowData(parsedData);
            setJsonError('');
        } catch (error) {
            setJsonError(error instanceof Error ? error.message : 'Invalid JSON format');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault(); // Prevent accidental form submission
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
                        {isEditing ? 'Hide Editor' : 'Edit JSON'}
                    </button>
                </div>

                {isEditing && (
                    <div className="mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input JSON Data
                                <span className="ml-2 text-gray-500">(Press Ctrl/Cmd + Enter to submit)</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    className="w-full h-48 p-2 border border-gray-300 rounded-md font-mono text-sm"
                                    placeholder="Paste your JSON here..."
                                    value={jsonInput}
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
