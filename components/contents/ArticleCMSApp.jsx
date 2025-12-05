'use client';

import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import Button from '@ds/Button/Button';
import { CloseCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@ds/icons/UIIcons';

const ARTICLES_PER_PAGE = 6;

const ModalDashedBorder = ({ className }) => (
    <svg 
        className={className}
        width="100%" 
        height="100%" 
        viewBox="0 0 663 297" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
    >
        <rect
            x="8.9"
            y="7.9"
            width="645.2"
            height="282.2"
            rx="5.1"
            className="stroke-accent-yellow-300"
            strokeWidth="1.8"
            strokeLinecap="square"
            strokeLinejoin="round"
            strokeDasharray="18 8"
            vectorEffect="non-scaling-stroke"
        />
    </svg>
);

// helper strip html buat summary
const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

// --- Article Detail Modal Component ---
const ArticleModal = ({ article, isOpen, onClose, onNavigate, allArticles }) => {
    if (!isOpen) return null;

    const defaultPlaceholder = "/images/gambarkucingarticle.png";
    
    const currentArticleIndex = allArticles.findIndex(a => a.id === article.id);
    const isFirstArticle = currentArticleIndex === 0;
    const isLastArticle = currentArticleIndex === allArticles.length - 1;
    
    const handleNextArticle = () => {
        if (!isLastArticle) {
            const nextArticle = allArticles[currentArticleIndex + 1];
            onNavigate(nextArticle);
        }
    };
    
    const handlePrevArticle = () => {
        if (!isFirstArticle) {
            const prevArticle = allArticles[currentArticleIndex - 1];
            onNavigate(prevArticle);
        }
    };

    // biar ga kebalik imageurl
    const imageUrl = article.imageUrl;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative z-10 p-8 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-h-5 font-bold text-accent-neutral-1000">
                            {article.title}
                        </h2>
                        <button 
                            onClick={onClose}
                            aria-label="Close modal"
                            className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md"
                        >
                            <CloseCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                           
                    <div className="w-full h-px bg-accent-neutral-200 mb-6" />

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Image Section */}
                        <div className="md:w-1/3 flex-shrink-0">
                            <div className="w-full aspect-square rounded-lg overflow-hidden shadow-md">
                                <img
                                    className="w-full h-full object-cover"
                                    alt={article.title || "Article image"}
                                    src={imageUrl || defaultPlaceholder}
                                    onError={(e) => { 
                                        console.error('❌ Modal image failed:', imageUrl);
                                        e.target.onerror = null; 
                                        e.target.src = "/images/gambarkucingarticle.png"; 
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-2/3 flex flex-col gap-4">
                            <div className="relative bg-white p-8 rounded-lg border-2 border-accent-yellow-300">
                                <ModalDashedBorder className="absolute inset-0 pointer-events-none p-1 stroke-accent-yellow-300" />
                                
                                {/* ✅ Option 1: Render HTML safely */}
                                <div 
                                    className="relative z-10 text-body-2 text-accent-neutral-1000 leading-relaxed space-y-4 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />

                                {/* ✅ Option 2: Plain text with paragraphs (safer)
                                <div className="relative z-10 text-body-2 text-accent-neutral-1000 leading-relaxed space-y-4">
                                    {stripHtmlTags(article.content)
                                        .split('\n')
                                        .filter(p => p.trim())
                                        .map((paragraph, index) => (
                                            <p key={index} className="text-justify">
                                                {paragraph}
                                            </p>
                                        ))
                                    }
                                </div>
                                */}
                            </div>

                            {/* Navigation Between Articles */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handlePrevArticle}
                                        disabled={isFirstArticle}
                                        aria-label="Previous article"
                                        className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-md ${
                                            isFirstArticle 
                                                ? 'bg-accent-neutral-250 opacity-50 cursor-not-allowed' 
                                                : 'bg-accent-neutral-250 hover:bg-accent-yellow-400'
                                        }`}
                                    >
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={handleNextArticle}
                                        disabled={isLastArticle}
                                        aria-label="Next article"
                                        className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-md ${
                                            isLastArticle 
                                                ? 'bg-accent-yellow-300 opacity-50 cursor-not-allowed' 
                                                : 'bg-accent-yellow-300 hover:bg-accent-yellow-400'
                                        }`}
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                                 
                        </div>
                    </div>
                    
                    <div className="w-full h-px bg-accent-neutral-200 mt-4" />
                </div>
            </div>
        </div>
    );
};

// --- Article Card Component ---
const ArticleCard = ({ article, onReadClick }) => {
    const defaultPlaceholder = "/images/gambarkucingarticle.png";
    
    //biar ga kebalik antara imageurl dan image_url
    const imageUrl = article.imageUrl

    return (
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-40 overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    alt={article.title || "Article image"}
                    src={imageUrl || defaultPlaceholder}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = defaultPlaceholder; 
                    }}
                />
            </div>
              
            {/* Content Section - PERBAIKAN: Hapus height tetap, biarkan auto */}
            <div className="relative pt-4 px-4 pb-0 flex flex-col flex-grow ">
                {/* ini tu svg yang garis itu */}
              <ModalDashedBorder className="absolute inset-0  z-0 pointer-events-none p-2 "/>

              
                
                <div className="relative z-10 flex flex-col gap-1 pt-2 px-2">
                    <p className="text-body-1 font-bold text-accent-neutral-1000 line-clamp-2">
                        {article.title}
                    </p>
                    <div className="w-full h-px bg-accent-neutral-200 mt-1" />
                </div>
                
                {/* summary */}
                <p className="relative z-10 text-body-2 text-accent-neutral-1000 line-clamp-3 px-2 flex-grow">
                    {article.summary}
                </p>

                <div className="mt-auto flex justify-end relative z-10 pb-0 pr-0">
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={onReadClick}
                        className="rounded-lg px-6 py-3 bg-accent-blue-400 border-accent-blue-400 hover:bg-accent-blue-500 active:scale-[0.98]"
                    >
                        Baca disini
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Pagination Button Component ---
const PaginationButton = ({ pageNumber, isActive, onClick, disabled }) => {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-150 shadow-sm";
    const activeClasses = "bg-accent-yellow-300 text-accent-neutral-1000 border border-yellow-500 hover:bg-accent-yellow-400";
    const inactiveClasses = "bg-gray-200 text-accent-neutral-1000 border border-text-accent-neutral-1000 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            aria-current={isActive ? 'page' : undefined}
            disabled={disabled}
        >
            {pageNumber}
        </button>
    );
};

// --- Main Application Component ---
const ArticleCMSApp = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    //fetch from api
    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching articles from API...');
            
            const response = await api.get('/api/articles');
            
            console.log('📦 Articles API Response:', response.data);
            
            // ✅ Debug: Cek imageUrl setiap artikel
            response.data.forEach((article, index) => {
                console.log(`📝 Article ${index + 1}:`, {
                    id: article.id,
                    title: article.title,
                    imageUrl: article.imageUrl,
                    image_url: article.image_url,
                    has_image: !!article.imageUrl || !!article.image_url
                });
            });
            
            const formattedArticles = response.data.map(article => {
                const content = article.content;
                const plainText = stripHtmlTags(content);
                const summary = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
                
                const imageUrl = article.imageUrl || article.image_url;
                
                console.log(`🖼️ Processing article "${article.title}":`, {
                    imageUrl,
                    willUsePlaceholder: !imageUrl
                });
                
                return {
                    ...article,
                    content,
                    summary,
                    imageUrl
                };
            });
            
            console.log('✅ Formatted articles:', formattedArticles);
            setArticles(formattedArticles);
        } catch (error) {
            console.error('❌ Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);

    const paginatedArticles = articles.slice(
        (currentPage - 1) * ARTICLES_PER_PAGE,
        currentPage * ARTICLES_PER_PAGE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleReadClick = (article) => {
        console.log('Opening article:', article);
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArticle(null);
    };

    const handleNavigateArticle = (article) => {
        setSelectedArticle(article);
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

    //loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-yellow-300"></div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 sm:p-8 flex justify-center">
                <div className="w-full max-w-6xl flex flex-col items-center gap-10">
                    {/* Article Grid */}
                    {articles.length > 0 ? (
                        <div className="w-full grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {paginatedArticles.map(article => (
                                <ArticleCard 
                                    key={article.id} 
                                    article={article}
                                    onReadClick={() => handleReadClick(article)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-body-1 text-accent-neutral-700">
                                Belum ada artikel yang dipublikasikan
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-3 p-4">
                            {renderPaginationButtons()}
                        </div>
                    )}
                </div>
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <ArticleModal
                    article={selectedArticle}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onNavigate={handleNavigateArticle}
                    allArticles={articles}
                />
            )}
        </>
    );
};

export default ArticleCMSApp;
