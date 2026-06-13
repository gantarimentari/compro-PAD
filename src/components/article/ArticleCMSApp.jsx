'use client';

import React, { useState, useEffect } from 'react';
import articleService from '@/lib/services/articleService';
import Button from '@/components/ui/Button/Button';
import { ModalDashedBorder } from '@/components/ui/frame/garisputus';
import { CloseCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons/UIIcons';
import { LoadingCondition } from '../shared/LoadingCondition';
const ARTICLES_PER_PAGE = 6;


// helper strip html buat summary
// ✅ FIXED: helper strip html TAPI preserve paragraph breaks
const stripHtmlTags = (html) => {
  if (!html) return '';

  let cleaned = html;

  // 1️⃣ Empty paragraph = SINGLE blank line
  cleaned = cleaned.replace(/<p><br\s*\/?><\/p>/gi, '\n');

  // 2️⃣ Normal paragraph end = SINGLE newline
  cleaned = cleaned.replace(/<\/p>/gi, '\n');

  // 3️⃣ Remove opening <p>
  cleaned = cleaned.replace(/<p>/gi, '');

  // 4️⃣ Strip remaining HTML safely
  const tmp = document.createElement('div');
  tmp.innerHTML = cleaned;
  let text = tmp.textContent || tmp.innerText || '';

  // 5️⃣ Normalize spacing: max 2 newlines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
};

// --- Article Detail Modal Component ---
const ArticleModal = ({ article, isOpen, onClose }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    
    if (!isOpen) return null;

    const defaultPlaceholder = "/images/gambarkucingarticle.png";
    
    const WORDS_PER_PAGE = 70;
    
    // ✅ Strip HTML dengan preserve paragraph breaks
    const textWithBreaks = stripHtmlTags(article.content || '');
    
    // ✅ Split by SINGLE space only (preserve \n\n)
    const words = textWithBreaks.split(' ').filter(word => word.trim());
    
    // Create pages with exactly 70 words each
    const contentPages = [];
    for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
        const pageWords = words.slice(i, i + WORDS_PER_PAGE);
        contentPages.push(pageWords.join(' '));
    }
    
    // Fallback if no content
    if (contentPages.length === 0) {
        contentPages.push(article.summary || 'Konten tidak tersedia');
    }
    
    const totalPages = contentPages.length;
    const isFirstPage = currentPageIndex === 0;
    const isLastPage = currentPageIndex === totalPages - 1;
    
    const handleNextPage = () => {
        if (!isLastPage) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (!isFirstPage) {
            setCurrentPageIndex(prev => prev - 1);
        }
    };
    
    // Reset page when article changes
    React.useEffect(() => {
        setCurrentPageIndex(0);
    }, [article.id]);

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
                <div className="relative z-10 p-8 flex flex-col max-h-[90vh]">
                    <div className="flex items-center justify-between mb-6 flex-shrink-0">
                        <h2 className="sm:text-h-5 text-body-1 font-bold text-accent-neutral-1000">
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
                    
                    <div className="w-full h-px bg-accent-neutral-200 mb-6 flex-shrink-0" />

                    <div className="flex flex-col md:flex-row gap-6 overflow-y-auto flex-1 hide-scrollbar">
                        <div className="md:w-1/3 flex-shrink-0">
                            <div className="w-full aspect-square rounded-lg overflow-hidden shadow-md">
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
                        </div>

                        <div className="md:w-2/3 flex flex-col gap-4">
                            <div className="relative bg-white p-6 rounded-lg border-2 border-accent-yellow-300 lg:min-h-[275px]">
                                <ModalDashedBorder className="absolute inset-0 pointer-events-none p-1 stroke-accent-yellow-300" />
                                
                                {/* whitespace buat spacing */}
                                <div className="relative z-10 text-body-2 text-accent-neutral-1000 leading-relaxed text-justify whitespace-pre-line">
                                    {contentPages[currentPageIndex]}
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent-neutral-200 flex-shrink-0">
                            <div className="flex gap-2 items-center">
                                {contentPages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPageIndex(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                                            index === currentPageIndex
                                                ? 'bg-accent-yellow-400'
                                                : 'bg-accent-neutral-300 hover:bg-accent-neutral-400'
                                        }`}
                                        aria-label={`Go to page ${index + 1}`}
                                    />
                                ))}
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={handlePrevPage}
                                    disabled={isFirstPage}
                                    aria-label="Previous page"
                                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-md ${
                                        isFirstPage 
                                            ? 'bg-accent-neutral-250 opacity-50 cursor-not-allowed' 
                                            : 'bg-accent-neutral-250 hover:bg-accent-yellow-400'
                                    }`}
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleNextPage}
                                    disabled={isLastPage}
                                    aria-label="Next page"
                                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-md ${
                                        isLastPage 
                                            ? 'bg-accent-yellow-300 opacity-50 cursor-not-allowed' 
                                            : 'bg-accent-yellow-300 hover:bg-accent-yellow-400'
                                    }`}
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
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
              <ModalDashedBorder className="absolute inset-0  z-0 pointer-events-none p-2 stroke-accent-yellow-300"/>

              
                
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
            
            const response = await articleService.getAll();
            
            console.log('📦 Articles API Response:', response);
            
            //  FILTER: Hanya ambil artikel dengan status 'Publish'
            const publishedArticles = response.filter(article => article.status === 'Publish');
            
            console.log(' Published articles only:', publishedArticles);
            
            //  Debug: Cek imageUrl setiap artikel
            publishedArticles.forEach((article, index) => {
                console.log(`📝 Article ${index + 1}:`, {
                    id: article.id,
                    title: article.title,
                    status: article.status,
                    imageUrl: article.imageUrl,
                    image_url: article.image_url,
                    has_image: !!article.imageUrl || !!article.image_url
                });
            });
            
            //  Gunakan publishedArticles yang sudah difilter
            const formattedArticles = publishedArticles.map(article => {
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
            
            console.log(' Formatted articles:', formattedArticles);
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
            <div className="flex justify-center items-center lg:min-h-[600px]">
               <LoadingCondition/>
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
