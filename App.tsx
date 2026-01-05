
import React, { useState, useCallback } from 'react';
import { ArtConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import { generateArtParams } from './services/geminiService';
import ArtCanvas from './components/ArtCanvas';

const App: React.FC = () => {
  const [config, setConfig] = useState<ArtConfig>(DEFAULT_CONFIG);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const newConfig = await generateArtParams(prompt);
      setConfig(newConfig);
    } catch (error) {
      console.error("Failed to generate art system:", error);
      alert("Something went wrong generating the art. Try another prompt!");
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate();
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Generative Canvas Layer */}
      <ArtCanvas config={config} />

      {/* UI Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 transform ${showControls ? 'translate-y-0' : 'translate-y-full opacity-0'}`}>
        <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-3xl shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe a mood (e.g., 'A rainy Tokyo night', 'Neon explosion')"
                className="w-full bg-black/40 text-white border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-white/30 transition-all text-lg"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <i className="fa-solid fa-sparkles"></i>
              {isLoading ? 'Dreaming...' : 'Evolve Vision'}
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50 items-center">
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Particles: {config.particleCount}
            </span>
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase">
              Mode: {config.shapeType}
            </span>
            <div className="flex gap-1">
              {config.colors.map((c, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-full border border-white/20" 
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="ml-auto flex items-center gap-1 italic opacity-80">
              Interactive Physics Playground • Move your mouse to interact
            </span>
          </div>
        </div>
      </div>

      {/* Control Toggle */}
      <button 
        onClick={() => setShowControls(!showControls)}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
      >
        <i className={`fa-solid ${showControls ? 'fa-eye-slash' : 'fa-gear'}`}></i>
      </button>

      {/* Branding */}
      <div className="fixed top-6 left-6 z-50 pointer-events-none">
        <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-lg animate-pulse" />
          LUMINA <span className="text-indigo-400">AI</span>
        </h1>
      </div>
    </div>
  );
};

export default App;
