'use client';

import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import { CloseCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon }  from '@ds/icons/UIIcons';

const IMAGES_PER_PAGE = 6;

// --- Image/Video Modal Component ---
const ImageModal = ({ image, isOpen, onClose, onNavigate, allImages }) => {
    if (!isOpen) return null;

    const defaultPlaceholder = "/images/gambarkucingarticle.png";
    
    const currentImageIndex = allImages.findIndex(img => img.id === image.id);
    const isFirstImage = currentImageIndex === 0;
    const isLastImage = currentImageIndex === allImages.length - 1;
    
    const handleNextImage = () => {
        if (!isLastImage) {
            const nextImage = allImages[currentImageIndex + 1];
            onNavigate(nextImage);
        }
    };
    
    const handlePrevImage = () => {
        if (!isFirstImage) {
            const prevImage = allImages[currentImageIndex - 1];
            onNavigate(prevImage);
        }
    };

    // helper function untuk convert YouTube URL ke embed URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        
        try {
            let videoId = null;
            
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                return url;
            }
            
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (error) {
            console.error('Error parsing YouTube URL:', error);
            return null;
        }
    };

    // support both camelCase (videoUrl) and snake_case (video_url)
    const videoUrl = image.videoUrl || image.video_url;
    const imageUrl = image.imageUrl || image.image_url;
    
    // cek apakah ini video
    const isVideo = (image.category === 'Video' && videoUrl) || (videoUrl && videoUrl.trim() !== '');
    const embedUrl = isVideo ? getYouTubeEmbedUrl(videoUrl) : null;

    console.log('🎬 Modal opened for:', {
        id: image.id,
        name: image.name,
        category: image.category,
        isVideo,
        videoUrl,
        imageUrl,
        embedUrl
    });

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative bg-transparent max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute -top-10 right-8 z-20 w-10 h-10 bg-accent-yellow-300 rounded-lg flex shadow-md items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-xl"
                > 
                    <CloseCircleIcon className="w-6 h-6" />
                </button>

                {/* Previous Button */}
                <button 
                    onClick={handlePrevImage}
                    disabled={isFirstImage}
                    aria-label="Previous image"
                    className={`absolute z-20 w-10 h-10 left-8 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-lg ${
                        isFirstImage 
                            ? 'bg-accent-neutral-250 opacity-50 cursor-not-allowed' 
                            : 'bg-accent-yellow-300 hover:bg-accent-yellow-400'
                    }`}
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                {/* image or video */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {!isVideo ? (
                        // display image
                        <img
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            alt={image.name || `Gallery image ${image.id}`}
                            src={imageUrl || defaultPlaceholder}
                            onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.src = defaultPlaceholder; 
                            }}
                        />
                    ) : embedUrl ? (
                        // display youtube video
                        <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                            <iframe
                                className="w-full h-full"
                                src={embedUrl}
                                title={image.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        // fallback kalo url tidak bisa dimuat
                        <div className="max-w-full max-h-[85vh] bg-gray-900 rounded-lg p-12 text-center">
                            <p className="text-white text-lg">Video tidak dapat dimuat</p>
                            <p className="text-gray-400 text-sm mt-2">URL: {videoUrl || 'Tidak ada URL'}</p>
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <button 
                    onClick={handleNextImage}
                    disabled={isLastImage}
                    aria-label="Next image"
                    className={`absolute right-8 z-20 w-10 h-10 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-lg ${
                        isLastImage 
                            ? 'bg-accent-neutral-250 opacity-50 cursor-not-allowed' 
                            : 'bg-accent-yellow-300 hover:bg-accent-yellow-400'
                    }`}
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
    );
};

// --- Image/Video Card Component ---
const ImageCard = ({ image, onClick }) => {
    const defaultPlaceholder = "/images/gambarkucingarticle.png";
    
    // support dua format
    const videoUrl = image.videoUrl || image.video_url;
    const imageUrl = image.imageUrl || image.image_url;
    
    const isVideo = (image.category === 'Video' && videoUrl) || (videoUrl && videoUrl.trim() !== '');

    // get youtube thumbnail
    const getYouTubeThumbnail = (url) => {
        if (!url) return null;
        
        try {
            let videoId = null;
            
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            }
            
            return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
        } catch (error) {
            return null;
        }
    };

    const thumbnailUrl = isVideo 
        ? getYouTubeThumbnail(videoUrl) 
        : (imageUrl || defaultPlaceholder);

    return (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg transition-all duration-300 group">
            <img
                className={`w-full h-full ${
                    isVideo 
                        ? 'object-cover'
                        : 'object-cover'
                }`}
                alt={image.name || `Gallery image ${image.id}`}
                src={thumbnailUrl || defaultPlaceholder}
                onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = defaultPlaceholder; 
                }}
            />
            
            {/* overlay video */}
            {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                    </div>
                </div>
            )}
            
            <button 
                onClick={onClick}
                aria-label={isVideo ? "Play video" : "View full image"}
                className="absolute bottom-3 md:w-11 md:h-11 right-3 w-10 h-10 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
            >
                <ExternalLinkIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

// --- Filter Button Component ---
const FilterButton = ({ label, isActive, onClick, count }) => {
    return (
        <button
            onClick={onClick}
            className={`text-accent-neutral-1000 px-6 py-2.5 border-[1px] rounded-[8px] text-body-2 transition-all duration-300 shadow-md ${
                isActive 
                    ? 'bg-accent-yellow-300 border-accent-yellow-400 scale-105' 
                    : 'bg-accent-neutral-250 border-2 hover:border-accent-neutral-250 hover:bg-accent-yellow-50'
            }`}
        >
            {label}
            {count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-white text-accent-neutral-1000' : 'bg-accent-neutral-100 text-accent-neutral-600'
                }`}>
                    {count}
                </span>
            )}
        </button>
    );
};

// --- Pagination Button Component ---
const PaginationButton = ({ pageNumber, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 rounded-md font-medium transition-all duration-300 shadow-sm ${
                isActive 
                    ? 'bg-accent-yellow-300 text-accent-neutral-1000 border-2 border-accent-yellow-400 scale-110' 
                    : 'bg-white text-accent-neutral-700 hover:bg-accent-yellow-50 border-2 border-accent-neutral-200'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {pageNumber}
        </button>
    );
};

// --- Main Gallery Component ---
const GaleryApp = ({ activeFilter }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch gambar dari api
    useEffect(() => {
        fetchImages();
    }, [activeFilter]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const params = activeFilter !== 'all' ? { days: activeFilter } : {};
            const response = await api.get('/api/media', { params });
            
            console.log('📦 Gallery API Response:', response.data);
            
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);

    const paginatedImages = images.slice(
        (currentPage - 1) * IMAGES_PER_PAGE,
        currentPage * IMAGES_PER_PAGE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleImageClick = (image) => {
        console.log('🖱️ Image clicked:', image);
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const handleNavigateImage = (image) => {
        setSelectedImage(image);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <PaginationButton
                    key={i}
                    pageNumber={i}
                    isActive={i === currentPage}
                    onClick={() => handlePageChange(i)}
                />
            );
        }
        return buttons;
    };

    // reset kalo ada pergantian filter
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-yellow-300"></div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex justify-center py-8">
                <div className="w-full max-w-7xl flex flex-col items-center gap-10 px-4">
                    
                    {/* Image Grid */}
                    {images.length > 0 ? (
                        <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                            {paginatedImages.map(image => (
                                <ImageCard 
                                    key={image.id} 
                                    image={image}
                                    onClick={() => handleImageClick(image)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-body-1 text-accent-neutral-700">
                                Tidak ada media untuk ditampilkan
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2 p-4">
                            {renderPaginationButtons()}
                        </div>
                    )}
                    
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onNavigate={handleNavigateImage}
                    allImages={images}
                />
            )}
        </>
    );
};

// --- Filter Buttons Container Component ---
export const GaleryFilterButtons = ({ activeFilter, onFilterChange }) => {
    const [statistics, setStatistics] = useState({
        all: 0,
        '7': 0,
        '14': 0,
        '30': 0,
        '90': 0,
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/api/media/statistics');
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    return (
        <div className="flex flex-wrap gap-3 justify-center py-6">
            <FilterButton 
                label="Semua" 
                isActive={activeFilter === 'all'} 
                onClick={() => onFilterChange('all')}
                count={statistics.all}
            />
            <FilterButton 
                label="7 Hari Terakhir" 
                isActive={activeFilter === '7'} 
                onClick={() => onFilterChange('7')}
                count={statistics['7']}
            />
            <FilterButton 
                label="14 Hari Terakhir" 
                isActive={activeFilter === '14'} 
                onClick={() => onFilterChange('14')}
                count={statistics['14']}
            />
            <FilterButton 
                label="30 Hari Terakhir" 
                isActive={activeFilter === '30'} 
                onClick={() => onFilterChange('30')}
                count={statistics['30']}
            />
            <FilterButton 
                label="90 Hari Terakhir" 
                isActive={activeFilter === '90'} 
                onClick={() => onFilterChange('90')}
                count={statistics['90']}
            />
        </div>
    );
};

export default GaleryApp;
