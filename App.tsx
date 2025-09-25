
import React, { useState, useCallback } from 'react';
import { generateImagesFromPrompt } from './services/geminiService';
import { AspectRatio, GeneratedImage } from './types';
import { ASPECT_RATIOS } from './constants';
import Header from './components/Header';
import ImageCard from './components/ImageCard';
import Spinner from './components/Spinner';
import { WandIcon, ImageIcon } from './components/Icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate images.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateImagesFromPrompt(prompt, numberOfImages, aspectRatio);
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError('Failed to generate images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, numberOfImages, aspectRatio]);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light font-sans">
      <Header />
      <main className="flex flex-col lg:flex-row p-4 md:p-8 gap-8">
        {/* Control Panel */}
        <div className="w-full lg:w-1/3 lg:max-w-md bg-brand-dark-secondary p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6 h-fit sticky top-8">
          <h2 className="text-2xl font-bold text-white">Image Generation</h2>
          
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
            <textarea
              id="prompt"
              rows={5}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition duration-200 resize-none placeholder-gray-500"
              placeholder="e.g., A majestic lion wearing a crown, cinematic, hyperrealistic"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 px-1 text-xs sm:text-sm rounded-md transition duration-200 font-semibold border ${
                    aspectRatio === ratio
                      ? 'bg-brand-purple text-white border-brand-purple'
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                  }`}
                  disabled={isLoading}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="numberOfImages" className="block text-sm font-medium text-gray-300 mb-2">Number of Images</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="4"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                disabled={isLoading}
              />
              <span className="bg-gray-800 text-white text-sm font-semibold w-10 h-10 flex items-center justify-center rounded-full border border-gray-600">
                {numberOfImages}
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-brand-purple hover:bg-brand-purple-light disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <Spinner />
                Generating...
              </>
            ) : (
              <>
                <WandIcon />
                Generate
              </>
            )}
          </button>
          {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
        </div>

        {/* Image Display Area */}
        <div className="w-full lg:w-2/3">
          {isLoading && (
             <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-gray-400">
                <Spinner className="w-16 h-16"/>
                <p className="text-xl mt-4 animate-pulse-fast">Conjuring your masterpiece...</p>
                <p className="text-sm mt-2">This may take a moment.</p>
             </div>
          )}
          
          {!isLoading && generatedImages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full min-h-[50vh] bg-brand-dark-secondary rounded-2xl border-2 border-dashed border-gray-700 p-8">
                <ImageIcon className="w-24 h-24 text-gray-600" />
                <h3 className="text-2xl font-bold mt-4 text-white">Your creations will appear here</h3>
                <p className="text-gray-400 mt-2 text-center max-w-md">Enter a prompt and click "Generate" to see the magic happen. Let your imagination run wild!</p>
             </div>
          )}

          {!isLoading && generatedImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {generatedImages.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
