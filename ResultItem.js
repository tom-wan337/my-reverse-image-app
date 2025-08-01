import React from 'react';

// Component for rendering a single search result item
const ResultItem = ({ result, handleMouseOver, handleMouseOut, showResultDetails }) => (
    <div
        className="flex items-center p-5 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer flex-col md:flex-row"
        onMouseEnter={(e) => handleMouseOver(e, result)}
        onMouseLeave={handleMouseOut}
        onClick={showResultDetails}
    >
        <img
            src={result.thumbnail}
            alt="Match"
            className="w-32 h-32 object-cover rounded-lg mr-0 md:mr-5 mb-4 md:mb-0 shadow-md"
            onError={(e) => e.target.src = 'https://placehold.co/128x128/f0f4f8/9ca3af?text=No+Image'}
        />
        <div className="flex-1 text-center md:text-left">
            <div className="font-semibold text-lg text-gray-800">{result.title}</div>
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">{result.url}</a>
            <div className="text-gray-500 text-sm mt-2 flex flex-wrap justify-center md:justify-start space-x-4">
                <span>📊 {result.confidence}% match</span>
                <span>🌐 {result.domain}</span>
                <span>📅 {result.metadata.lastSeen}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 h-1.5 rounded-full"
                    style={{ width: `${result.confidence}%` }}
                />
            </div>
            <div className="text-sm text-gray-400 mt-2">Source: {result.source}</div>
        </div>
    </div>
);

export default ResultItem;
