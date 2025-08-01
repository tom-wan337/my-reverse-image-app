import React, { useState, useEffect } from 'react';
import ResultItem from './components/ResultItem.js';
import Modal from './components/Modal.js';

// Main App component for the entire application
const App = () => {
    // State variables for the application
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [sources, setSources] = useState({});
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTime, setSearchTime] = useState(0);
    const [activeTab, setActiveTab] = useState('all');
    const [isHovering, setIsHovering] = useState(false);
    const [hoverInfo, setHoverInfo] = useState({ title: '', url: '', thumbnail: '' });
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [modalResult, setModalResult] = useState(null);

    // Initialize search sources on component mount
    useEffect(() => {
        // Mock data for search sources. In a real app, this might come from a server.
        const mockSources = {
            gemini: { name: 'Gemini AI Search', icon: 'https://placehold.co/24x24/1d4ed8/ffffff?text=AI', description: 'Generates a query to perform a Google Search', enabled: true, category: 'ai' },
            google: { name: 'Google Images', icon: 'https://placehold.co/24x24/4285F4/ffffff?text=G', description: 'Comprehensive image search', enabled: true, category: 'general' },
            yandex: { name: 'Yandex Images', icon: 'https://placehold.co/24x24/FFD300/000000?text=Y', description: 'Strong facial recognition', enabled: true, category: 'general' },
            bing: { name: 'Bing Visual Search', icon: 'https://placehold.co/24x24/0078D4/ffffff?text=B', description: 'Microsoft\'s visual search', enabled: true, category: 'general' },
            tineye: { name: 'TinEye', icon: 'https://placehold.co/24x24/C53112/ffffff?text=T', description: 'Exact image match detection', enabled: true, category: 'specialized' },
            pimeyes: { name: 'PimEyes', icon: 'https://placehold.co/24x24/FF598F/ffffff?text=P', description: 'Advanced facial recognition', enabled: true, category: 'facial' },
            facecheck: { name: 'FaceCheck', icon: 'https://placehold.co/24x24/38A169/ffffff?text=F', description: 'Criminal database and safety verification', enabled: true, category: 'security' },
            socialcatfish: { name: 'Social Catfish', icon: 'https://placehold.co/24x24/A020F0/ffffff?text=S', description: 'Social media profile detection', enabled: true, category: 'social' },
            labnol: { name: 'Labnol Search', icon: 'https://placehold.co/24x24/7f8c8d/ffffff?text=L', description: 'Multi-engine reverse search', enabled: true, category: 'aggregator' },
            duplichecker: { name: 'DupliChecker', icon: 'https://placehold.co/24x24/f1c40f/000000?text=D', description: 'Image plagiarism and duplicate detection', enabled: true, category: 'specialized' },
            prepostseo: { name: 'Prepostseo', icon: 'https://placehold.co/24x24/3498db/ffffff?text=R', description: 'Free reverse image search', enabled: true, category: 'general' }
        };
        setSources(mockSources);
    }, []);

    // Helper function to get color for a category
    const getColorForCategory = (category) => {
        const colors = {
            general: '4285F4',
            facial: 'FF598F',
            security: '38A169',
            social: 'A020F0',
            specialized: 'C53112',
            aggregator: '7f8c8d',
            ai: '1d4ed8'
        };
        return colors[category] || '6c757d';
    };

    // Handle file selection from input or drag-and-drop
    const handleFileSelect = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please select a valid image file (JPG, PNG, GIF, WebP).');
            setSelectedFile(null);
            setImagePreviewUrl('');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB.');
            setSelectedFile(null);
            setImagePreviewUrl('');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreviewUrl(e.target.result);
            setError('');
        };
        reader.onerror = () => {
            setError('Failed to read image file. Please try again.');
            setSelectedFile(null);
            setImagePreviewUrl('');
        };
        reader.readAsDataURL(file);
    };

    // Toggle the enabled state of a search source
    const toggleSource = (sourceKey) => {
        setSources(prevSources => ({
            ...prevSources,
            [sourceKey]: { ...prevSources[sourceKey], enabled: !prevSources[sourceKey].enabled }
        }));
    };

    // Select or deselect all sources
    const toggleAllSources = (select) => {
        setSources(prevSources => {
            const newSources = {};
            for (const key in prevSources) {
                newSources[key] = { ...prevSources[key], enabled: select };
            }
            return newSources;
        });
    };
    
    // Generates mock results based on the source key, to simulate a backend response
    const generateMockResults = (sourceKey, count) => {
        const results = [];
        const source = sources[sourceKey];
        for (let i = 0; i < count; i++) {
            const confidence = Math.floor(Math.random() * 40) + 60;
            const url = `https://example.com/${sourceKey}/result/${Math.floor(Math.random() * 9000) + 1000}`;
            
            const metadata = {
                "imageSize": `${Math.floor(Math.random() * 801) + 200}x${Math.floor(Math.random() * 801) + 200}`,
                "fileType": ['JPG', 'PNG', 'WebP'][Math.floor(Math.random() * 3)],
                "lastSeen": `${Math.floor(Math.random() * 30) + 1} days ago`
            };

            // Add specific metadata for facial search sources
            if (source.category === 'facial' || source.category === 'security' || source.category === 'social') {
                 metadata.faceCount = 1;
                 metadata.ageEstimate = `${Math.floor(Math.random() * 40) + 20}-${Math.floor(Math.random() * 40) + 25}`;
                 metadata.profileSource = sourceKey === 'pimeyes' ? 'Private Database' : 'Public Records';
            }

            results.push({
                id: `${sourceKey}-${i}`,
                title: `${source.name} Match Found`,
                url: url,
                thumbnail: `https://picsum.photos/120/120?random=${sourceKey}${i}`,
                confidence: confidence,
                source: source.name,
                sourceKey: sourceKey,
                domain: url.split('://')[1].split('/')[0],
                metadata: metadata
            });
        }
        return results;
    };
    
    // The core function to perform the search, structured to call a backend API
    const performSearch = async () => {
        if (!selectedFile) {
            setError('Please upload an image before starting the search.');
            return;
        }

        const enabledSourceKeys = Object.keys(sources).filter(key => sources[key].enabled);
        if (enabledSourceKeys.length === 0) {
            setError('Please select at least one search source.');
            return;
        }

        setError('');
        setSearchResults(null);
        setIsLoading(true);
        const startTime = Date.now();

        try {
            // In a real-world scenario, you would send the image and selected sources
            // to a backend server. The server would handle all the API calls.
            
            // This is a conceptual representation of the fetch call to your backend.
            // Replace 'http://your-backend-server.com/api/search' with your actual endpoint.
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('sources', JSON.stringify(enabledSourceKeys));
            
            // Simulating the network delay and response from a backend
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // --- This section simulates the backend's response ---
            const mockBackendResponse = {};
            enabledSourceKeys.forEach(sourceKey => {
                 mockBackendResponse[sourceKey] = generateMockResults(sourceKey, Math.floor(Math.random() * 5) + 1);
            });
            // --- End of simulated response ---
            
            // In a real app, you would parse the JSON response from your backend here.
            // const response = await fetch('http://your-backend-server.com/api/search', {
            //     method: 'POST',
            //     body: formData,
            // });
            // const result = await response.json();
            
            setSearchResults(mockBackendResponse);

        } catch (e) {
            console.error("Error during search:", e);
            setError('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
            setSearchTime(((Date.now() - startTime) / 1000).toFixed(1));
            setActiveTab('all');
        }
    };

    // Calculate total results and other stats
    const totalResults = searchResults
        ? Object.values(searchResults).flat().length
        : 0;
    const sourcesSearched = searchResults ? Object.keys(searchResults).length : 0;
    const allFlatResults = searchResults ? Object.values(searchResults).flat() : [];
    const avgConfidence = allFlatResults.length > 0
        ? Math.round(allFlatResults.reduce((sum, r) => sum + r.confidence, 0) / allFlatResults.length)
        : 0;

    // Handle mouse events for the floating preview
    const handleMouseOver = (e, result) => {
        // Find the thumbnail, title, and url elements within the current target
        // The error was that these elements were not guaranteed to exist.
        // We can access the properties directly from the 'result' object passed to the function
        const thumbnail = result.thumbnail;
        const title = result.title;
        const url = result.url;
        
        setHoverInfo({ title, url, thumbnail });
        setIsHovering(true);
    };

    const handleMouseMove = (e) => {
        let x = e.clientX + 15;
        let y = e.clientY + 15;
        const previewWidth = 400; // Hardcoded preview width
        const previewHeight = 200; // Estimated preview height

        if (x + previewWidth > window.innerWidth - 20) {
            x = e.clientX - previewWidth - 15;
        }
        if (y + previewHeight > window.innerHeight - 20) {
            y = e.clientY - previewHeight - 15;
        }
        if (x < 10) x = 10;
        if (y < 10) y = 10;

        setHoverPosition({ x, y });
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };
    
    const closeModal = () => setModalResult(null);

    // Filter results based on the active tab
    const getFilteredResults = () => {
        if (!searchResults) return [];
        if (activeTab === 'all') {
            return Object.values(searchResults).flat().sort((a, b) => b.confidence - a.confidence);
        }
        return searchResults[activeTab] || [];
    };

    const enabledSourcesCount = Object.keys(sources).filter(key => sources[key].enabled).length;
    const isSearchDisabled = !selectedFile || enabledSourcesCount === 0;

    return (
        <div className="font-[Inter] bg-gradient-to-br from-indigo-500 to-purple-700 min-h-screen p-5 text-gray-800">
            {/* The main container with a nice shadow and rounded corners */}
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-12">
                <div className="text-center pb-8 border-b-2 border-gray-100">
                    <h1 className="text-4xl font-bold text-gray-900 drop-shadow-sm">Advanced Reverse Image Search</h1>
                    <p className="mt-2 text-gray-500 text-lg">Multi-source image search with a powerful, integrated backend.</p>
                </div>

                {/* Upload section */}
                <div className="py-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📁 Upload Your Image</h2>
                    <div
                        className="p-16 border-4 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-500'); }}
                        onDragLeave={(e) => { e.currentTarget.classList.remove('border-blue-500'); }}
                        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-500'); handleFileSelect(e.dataTransfer.files[0]); }}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <div className="text-center">
                            <span className="text-6xl text-gray-400">📸</span>
                            <p className="mt-4 text-xl font-medium text-gray-600">Click or Drag & Drop an Image</p>
                            <p className="mt-2 text-sm text-gray-400">Supports JPG, PNG, GIF, WebP (Max 10MB)</p>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                            />
                        </div>
                    </div>
                    {imagePreviewUrl && (
                        <div className="mt-8 text-center">
                            <img src={imagePreviewUrl} alt="Preview" className="mx-auto max-w-xs md:max-w-sm rounded-2xl shadow-lg border-2 border-gray-100" />
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-4 text-white bg-red-500 rounded-xl font-medium shadow-md text-center">
                            ❌ {error}
                        </div>
                    )}
                </div>

                {/* Search sources section */}
                <div className="py-8 border-t-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🌐 Select Search Sources</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Object.entries(sources).map(([key, source]) => (
                            <div
                                key={key}
                                className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${source.enabled ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-gray-400'}`}
                                onClick={() => toggleSource(key)}
                            >
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={source.enabled}
                                        readOnly
                                        className="h-5 w-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                                    />
                                    <img src={source.icon} alt={source.name} className="w-6 h-6 rounded mr-2" style={{ backgroundColor: `#${getColorForCategory(source.category)}` }} />
                                    <span className="font-semibold text-lg text-gray-800">{source.name}</span>
                                </div>
                                <p className="text-sm text-gray-500">{source.description}</p>
                                <div className="mt-2 text-xs font-medium text-white px-2 py-1 rounded-full w-fit" style={{ backgroundColor: `#${getColorForCategory(source.category)}` }}>
                                    {source.category}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-full transition-colors duration-200"
                            onClick={() => toggleAllSources(true)}
                        >
                            Select All
                        </button>
                        <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-full transition-colors duration-200"
                            onClick={() => toggleAllSources(false)}
                        >
                            Deselect All
                        </button>
                    </div>
                </div>

                {/* Search button section */}
                <div className="py-8 text-center border-t-2 border-gray-100">
                    <button
                        className={`font-extrabold text-white text-xl py-4 px-12 rounded-full shadow-lg transition-all duration-300 transform ${isSearchDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:shadow-xl'}`}
                        onClick={performSearch}
                        disabled={isSearchDisabled}
                    >
                        🚀 Start Multi-Source Search ({enabledSourcesCount} Source{enabledSourcesCount !== 1 ? 's' : ''})
                    </button>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        <p className="mt-4 text-lg text-gray-600 font-medium">Searching across selected sources...</p>
                    </div>
                )}

                {/* Results section */}
                {searchResults && (
                    <div className="py-8 border-t-2 border-gray-100">
                        {/* Stats bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl mb-8">
                            <div className="text-center p-3">
                                <p className="text-4xl font-bold text-blue-600">{totalResults}</p>
                                <p className="text-sm text-gray-500 mt-1">Total Results</p>
                            </div>
                            <div className="text-center p-3">
                                <p className="text-4xl font-bold text-purple-600">{sourcesSearched}</p>
                                <p className="text-sm text-gray-500 mt-1">Sources Searched</p>
                            </div>
                            <div className="text-center p-3">
                                <p className="text-4xl font-bold text-green-600">{avgConfidence}%</p>
                                <p className="text-sm text-gray-500 mt-1">Avg Confidence</p>
                            </div>
                            <div className="text-center p-3">
                                <p className="text-4xl font-bold text-orange-600">{searchTime}s</p>
                                <p className="text-sm text-gray-500 mt-1">Search Time</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎯 Search Results</h2>
                        
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 justify-center mb-8 border-b-2 border-gray-100 pb-4">
                            <button
                                className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All Results <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold bg-white text-blue-600">{totalResults}</span>
                            </button>
                            {Object.entries(searchResults).map(([sourceKey, results]) => (
                                results.length > 0 && (
                                    <button
                                        key={sourceKey}
                                        className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${activeTab === sourceKey ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        onClick={() => setActiveTab(sourceKey)}
                                    >
                                        {sources[sourceKey].name} <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold bg-white text-blue-600">{results.length}</span>
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Result list */}
                        {getFilteredResults().length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {getFilteredResults().map(result => (
                                    <ResultItem
                                        key={result.id}
                                        result={result}
                                        handleMouseOver={handleMouseOver}
                                        handleMouseOut={handleMouseOut}
                                        showResultDetails={() => setModalResult(result)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                No results found for this source.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating preview for result thumbnails */}
            {isHovering && (
                <div
                    className="fixed z-50 p-4 bg-white rounded-xl shadow-2xl max-w-sm pointer-events-none transition-opacity duration-100"
                    style={{
                        top: hoverPosition.y,
                        left: hoverPosition.x,
                        transform: 'translate(0, 0)', // Position based on mouse
                        opacity: isHovering ? 1 : 0
                    }}
                >
                    <img src={hoverInfo.thumbnail} alt="Preview" className="w-full rounded-lg mb-2" />
                    <p className="font-semibold text-sm">{hoverInfo.title}</p>
                    <p className="text-xs text-gray-500 break-all">{hoverInfo.url}</p>
                </div>
            )}
            {modalResult && <Modal result={modalResult} onClose={closeModal} />}
        </div>
    );
};

export default App;
