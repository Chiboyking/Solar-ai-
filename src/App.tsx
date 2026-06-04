/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download, Terminal, FolderArchive, ArrowRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-200">
      <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-8">
        
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
          <Terminal className="text-emerald-400 w-8 h-8" />
        </div>

        <h1 className="text-3xl font-bold font-sans tracking-tight text-white mb-3">
          Python Project Generated
        </h1>
        
        <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
          Your requested Python Flask application, <strong className="text-white">Nigeria Solar AI Predictor</strong>, has been completely written to the filesystem. 
          To run the Python backend and train the TensorFlow models natively, you must export the workspace.
        </p>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 mb-8">
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FolderArchive className="w-4 h-4" /> 
            Directory Structure Created
          </h3>
          <ul className="space-y-2 text-sm font-mono text-neutral-500">
            <li><span className="text-blue-400">📁 nigeria_solar_ai/</span></li>
            <li className="pl-4">📄 run_windows.bat <span className="text-emerald-400">(Click to Run - Windows)</span></li>
            <li className="pl-4">📄 run_mac_linux.sh <span className="text-emerald-400">(Click to Run - Mac/Linux)</span></li>
            <li className="pl-4">📄 app.py <span className="text-neutral-600">(Flask Server)</span></li>
            <li className="pl-4">📄 fetch_data.py <span className="text-neutral-600">(NASA & OpenWeatherMap API)</span></li>
            <li className="pl-4">📄 train_models.py <span className="text-neutral-600">(ANN, CNN, CNN-LSTM)</span></li>
            <li className="pl-4">📄 utils.py</li>
            <li className="pl-4">📄 requirements.txt</li>
            <li className="pl-4">📄 main.ipynb</li>
            <li className="pl-4"><span className="text-emerald-400">📁 templates/</span> <span className="text-neutral-600">(HTML/JS Frontend)</span></li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-neutral-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
            <div>
              <p className="font-medium text-white">Export Workspace</p>
              <p className="text-sm text-neutral-400">Click the <strong className="text-neutral-300">Share / Export</strong> menu in AI Studio and select <strong className="text-neutral-300">Export to ZIP</strong>.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-neutral-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
            <div>
              <p className="font-medium text-white">Extract and Run</p>
              <p className="text-sm text-neutral-400 mb-2">Extract the ZIP file and simply double-click the run script for your operating system.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2">
                  <p className="text-xs text-neutral-500 font-bold mb-1">Windows</p>
                  <code className="text-emerald-400 text-xs font-mono">Double-click run_windows.bat</code>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2">
                  <p className="text-xs text-neutral-500 font-bold mb-1">Mac / Linux</p>
                  <code className="text-emerald-400 text-xs font-mono">bash run_mac_linux.sh</code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-neutral-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
            <div>
              <p className="font-medium text-white">Watch the Magic</p>
              <p className="text-sm text-neutral-400 mb-2">The script will automatically install dependencies, fetch real-time datasets, train the models, and launch the dashboard locally!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

