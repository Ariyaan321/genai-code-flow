import React, { useState, useRef } from 'react';
import axios from 'axios';
import ProcessFlowChart from './components/ProcessFlowChart';
import { ProcessFlow } from './types';
import { AlertCircle, Send, Upload, Loader2 } from 'lucide-react';

const defaultData: ProcessFlow = {
  phases: []
};

const API_URL = 'http://127.0.0.1:5000/api/summary'; // Replace with your actual API endpoint

function App() {
  const [flowData, setFlowData] = useState<ProcessFlow>(defaultData);
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!codeInput.trim()) {
      setError('Please enter some code or upload a file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(API_URL, {
        code: codeInput
      });

      if (response.data) {
        setFlowData(response.data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error processing code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setCodeInput(text);
      setError('');
      setIsEditing(true);
    } catch (error) {
      setError('Error reading file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Process Flow Visualization</h1>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".py,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isEditing ? 'Hide Editor' : 'Edit Code'}
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="mb-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Code
                <span className="ml-2 text-gray-500">(Press Ctrl/Cmd + Enter to submit)</span>
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-48 p-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="Paste your code here..."
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1 disabled:bg-blue-300"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isLoading ? 'Processing...' : 'Submit'}</span>
                </button>
              </div>
              {error && (
                <div className="mt-2 text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
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