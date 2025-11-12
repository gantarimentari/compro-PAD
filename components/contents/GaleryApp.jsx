'use client';

import React, { useState } from 'react';
import { CloseCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon }  from '@ds/icons/UIIcons';

// --- Mock Data ---
const MOCK_IMAGES = [
  { id: 1, timeStamp: '2025-11-05', imageUrl: '/images/gambarkucingarticle.png' },
  { id: 2, timeStamp: '2025-11-02', imageUrl: '/images/hamster.png' },
  { id: 3, timeStamp: '2025-10-29', imageUrl: '/galery/galery-3.jpg' },
  { id: 4, timeStamp: '2025-10-25', imageUrl: '/galery/galery-4.jpg' },
  { id: 5, timeStamp: '2025-10-15', imageUrl: '/galery/galery-5.jpg' },
  { id: 6, timeStamp: '2023-10-06', imageUrl: '/galery/galery-6.jpg' },
  { id: 7, timeStamp: '2025-09-15', imageUrl: '/galery/galery-7.jpg' },
  { id: 8, timeStamp: '2025-08-28', imageUrl: '/galery/galery-8.jpg' },
  { id: 9, timeStamp: '2025-08-10', imageUrl: '/galery/galery-9.jpg' },
];

const IMAGES_PER_PAGE = 6;

// --- Helper Function untuk Filter Dinamis ---
const filterImagesByDays = (images, days) => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return images.filter(image => {
        const imageDate = new Date(image.timeStamp);
        return imageDate >= cutoffDate;
    });
};

// --- Image Modal Component ---
const ImageModal = ({ image, isOpen, onClose, onNavigate }) => {
    if (!isOpen) return null;

    const defaultPlaceholder = "/images/gambarkucingarticle.png";
    
    // Cari index gambar saat ini dalam MOCK_IMAGES
    const currentImageIndex = MOCK_IMAGES.findIndex(img => img.id === image.id);
    const isFirstImage = currentImageIndex === 0;
    const isLastImage = currentImageIndex === MOCK_IMAGES.length - 1;
    
    const handleNextImage = () => {
        if (!isLastImage) {
            const nextImage = MOCK_IMAGES[currentImageIndex + 1];
            onNavigate(nextImage);
        }
    };
    
    const handlePrevImage = () => {
        if (!isFirstImage) {
            const prevImage = MOCK_IMAGES[currentImageIndex - 1];
            onNavigate(prevImage);
        }
    };

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
                    className="absolute  -top-10 right-8 z-20 w-10 h-10 bg-accent-yellow-300 rounded-lg flex shadow-md items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-xl"
                > 
                    <CloseCircleIcon className="w-6 h-6" />
                </button>
                
               

                {/* Previous Button */}
                <button 
                    onClick={handlePrevImage}
                    disabled={isFirstImage}
                    aria-label="Previous image"
                    className={`absolute   z-20 w-10 h-10 left-8 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-lg ${
                        isFirstImage 
                            ? 'bg-accent-neutral-250 opacity-50 cursor-not-allowed' 
                            : 'bg-accent-yellow-300 hover:bg-accent-yellow-400'
                    }`}
                >
                    <ChevronLeftIcon   className="w-6 h-6" />
                      
            
                </button>

                {/* Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        alt={`Gallery image ${image.id}`}
                        src={image.imageUrl || defaultPlaceholder}
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = defaultPlaceholder; 
                        }}
                    />
                    
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
                    <ChevronRightIcon  />
                </button>
            </div>
        </div>
    );
};

// --- Image Card Component ---
const ImageCard = ({ image, onClick }) => {
    const defaultPlaceholder = "/images/gambarkucingarticle.png";

    return (
        <div 
            className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg transition-all duration-300"
        >
            <img
                className="w-full h-full object-cover"
                alt={`Gallery image ${image.id}`}
                src={image.imageUrl || defaultPlaceholder}
                onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = defaultPlaceholder; 
                }}
            />
            
            {/* Button selalu terlihat di pojok kanan atas */}
            <button 
                onClick={onClick}
                aria-label="View full image"
                className="absolute bottom-3 md:w-11 md:h-11  right-3 w-10 h-10 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
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
            className={` text-accent-neutral-1000 px-6 py-2.5 border-[1px] rounded-[8px] text-body-2 transition-all duration-300 shadow-md ${
                isActive 
                    ? 'bg-accent-yellow-300   border-accent-yellow-400 scale-105' 
                    : 'bg-accent-neutral-250  border-2 hover:border-accent-neutral-250 hover:bg-accent-yellow-50'
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

    // Filter images berdasarkan hari secara DINAMIS
    const getFilteredImages = () => {
        if (activeFilter === 'all') {
            return MOCK_IMAGES;
        }
        // Parse filter value (e.g., '7' -> 7)
        const days = parseInt(activeFilter);
        return filterImagesByDays(MOCK_IMAGES, days);
    };

    const filteredImages = getFilteredImages();
    const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

    const paginatedImages = filteredImages.slice(
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

    // Reset halaman ketika filter berubah
    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    return (
        <>
            <div className="w-full flex justify-center py-8">
                <div className="w-full max-w-7xl flex flex-col items-center gap-10 px-4">
                    
                    {/* Image Grid */}
                    <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        {paginatedImages.map(image => (
                            <ImageCard 
                                key={image.id} 
                                image={image}
                                onClick={() => handleImageClick(image)}
                            />
                        ))}
                    </div>

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
                />
            )}
        </>
    );
};

// --- Filter Buttons Container Component (Export untuk digunakan di page.jsx) ---
export const GaleryFilterButtons = ({ activeFilter, onFilterChange }) => {

    const counts = {
        all: MOCK_IMAGES.length,
        '7': filterImagesByDays(MOCK_IMAGES, 7).length,
        '14': filterImagesByDays(MOCK_IMAGES, 14).length,
        '30': filterImagesByDays(MOCK_IMAGES, 30).length,
        '90': filterImagesByDays(MOCK_IMAGES, 90).length,
    };

    return (
        <div className="flex flex-wrap gap-3 justify-center py-6">
            <FilterButton 
                label="Semua" 
                isActive={activeFilter === 'all'} 
                onClick={() => onFilterChange('all')}
               
            />
            <FilterButton 
                label="7 Hari Terakhir" 
                isActive={activeFilter === '7'} 
                onClick={() => onFilterChange('7')}
             
            />
            <FilterButton 
                label="14 Hari Terakhir" 
                isActive={activeFilter === '14'} 
                onClick={() => onFilterChange('14')}
                
            />
            <FilterButton 
                label="30 Hari Terakhir" 
                isActive={activeFilter === '30'} 
                onClick={() => onFilterChange('30')}
                
            />
            <FilterButton 
                label="90 Hari Terakhir" 
                isActive={activeFilter === '90'} 
                onClick={() => onFilterChange('90')}
               
            />
        </div>
    );
};

export default GaleryApp;
