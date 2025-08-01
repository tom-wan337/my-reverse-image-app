import React from 'react';

const Modal = ({ result, onClose }) => {
    if (!result) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white p-8 rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl"
                    onClick={onClose}
                >&times;</button>
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">🔍 Result Details</h3>
                </div>
                <img
                    src={result.thumbnail}
                    alt="Result"
                    className="w-full max-w-sm h-auto mx-auto mb-6 rounded-lg object-cover shadow-lg"
                    onError={(e) => e.target.src = 'https://placehold.co/384x384/f0f4f8/9ca3af?text=No+Image'}
                />
                <h4 className="text-xl font-bold mb-2 text-gray-800">{result.title}</h4>
                <p className="mb-2"><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{result.url}</a></p>
                <p className="mb-2">
                    <strong>Confidence:</strong>{' '}
                    <span className={`font-bold text-${result.confidence > 80 ? 'green' : result.confidence > 60 ? 'yellow' : 'red'}-600`}>
                        {result.confidence}%
                    </span>
                </p>
                <p className="mb-2"><strong>Source:</strong> {result.source}</p>
                <p className="mb-2"><strong>Domain:</strong> {result.domain}</p>
                {result.metadata.imageSize && <p className="mb-2"><strong>Image Size:</strong> {result.metadata.imageSize}</p>}
                {result.metadata.fileType && <p className="mb-2"><strong>File Type:</strong> {result.metadata.fileType}</p>}
                {result.metadata.lastSeen && <p className="mb-2"><strong>Last Seen:</strong> {result.metadata.lastSeen}</p>}
                {result.metadata.faceCount && <p className="mb-2"><strong>Faces Detected:</strong> {result.metadata.faceCount}</p>}
                {result.metadata.ageEstimate && <p className="mb-2"><strong>Estimated Age:</strong> {result.metadata.ageEstimate}</p>}
                <div className="mt-8 text-center space-x-4">
                    <button
                        className="bg-blue-600 text-white font-medium px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => window.open(result.url, '_blank')}
                    >
                        Visit Source
                    </button>
                    <button
                        className="bg-gray-500 text-white font-medium px-6 py-3 rounded-full hover:bg-gray-600 transition-colors duration-200"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
