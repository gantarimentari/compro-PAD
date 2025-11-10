'use client';

import React, { useState } from 'react';
import Button from '@ds/Button/button';
import { CloseCircleIcon, ChevronLeftIcon, ChevronRightIcon }  from '@ds/icons/UIIcons';

// ---  data dummy ---
const MOCK_ARTICLES = [
    { 
        id: 1, 
        title: "Manfaat Memelihara Kucing", 
        imageUrl: "/images/gambarkucingarticle.png",
        content: [
            "Bagi pencinta kucing, hewan mungil ini bisa memberikan kebahagiaan bagi siapa pun yang memelihara atau berinteraksi dengannya. Kucing dikenal sebagai hewan yang mandiri namun penuh kasih sayang.",
            "Penelitian menunjukkan bahwa memelihara kucing dapat mengurangi stres dan kecemasan. Suara dengkuran kucing memiliki efek menenangkan yang dapat menurunkan tekanan darah dan meningkatkan mood.",
            "Kucing juga merupakan teman yang sempurna untuk orang yang tinggal sendiri. Mereka memberikan companionship tanpa memerlukan perhatian konstan seperti hewan peliharaan lainnya.",
            "Selain itu, merawat kucing dapat mengajarkan tanggung jawab, terutama pada anak-anak. Memberi makan, membersihkan litter box, dan bermain dengan kucing adalah kegiatan yang membangun karakter."
        ]
    },
    { 
        id: 2, 
        title: "Cara Merawat Anjing Golden", 
        imageUrl: "/images/hamster.png",
        content: [
            "Golden Retrievers adalah anjing yang ramah dan cerdas, tetapi membutuhkan perawatan khusus untuk bulu dan kesehatan mereka. Ras ini terkenal dengan sifatnya yang lembut dan mudah dilatih.",
            "Perawatan bulu Golden Retriever sangat penting karena mereka memiliki double coat yang tebal. Sisir bulu mereka minimal 3-4 kali seminggu untuk mencegah matting dan mengurangi bulu rontok.",
            "Olahraga rutin sangat penting untuk Golden Retriever. Mereka memerlukan minimal 1-2 jam aktivitas fisik setiap hari, seperti jalan-jalan, berlari, atau bermain fetch di taman.",
            "Jangan lupa untuk membawa Golden Retriever Anda ke dokter hewan secara rutin untuk pemeriksaan kesehatan. Ras ini rentan terhadap hip dysplasia dan masalah jantung, sehingga deteksi dini sangat penting."
        ]
    },
    { 
        id: 3, 
        title: "Pentingnya Vaksinasi Hewan", 
        imageUrl: "tes",
        content: [
            "Vaksinasi adalah langkah krusial dalam menjaga kesehatan hewan peliharaan Anda dari berbagai penyakit menular yang berbahaya. Ini adalah investasi terbaik untuk kesehatan jangka panjang hewan kesayangan.",
            "Vaksin core seperti rabies, distemper, dan parvovirus harus diberikan kepada semua hewan peliharaan. Vaksin ini melindungi dari penyakit yang dapat berakibat fatal dan mudah menular.",
            "Jadwal vaksinasi dimulai sejak hewan masih muda, biasanya pada usia 6-8 minggu. Booster shots diperlukan secara berkala untuk menjaga kekebalan tubuh tetap optimal.",
            "Konsultasikan dengan dokter hewan untuk menentukan jadwal vaksinasi yang tepat sesuai dengan usia, kondisi kesehatan, dan gaya hidup hewan peliharaan Anda."
        ]
    },
    { 
        id: 4, 
        title: "Tips Mengatasi Kucing Muntah", 
        imageUrl: "ha;lo:",
        content: [
            "Muntah pada kucing sering terjadi, namun penting untuk mengetahui kapan itu normal dan kapan harus dibawa ke dokter hewan. Hairball adalah penyebab umum muntah pada kucing.",
            "Jika kucing muntah sesekali dan tetap aktif serta makan dengan baik, biasanya tidak perlu khawatir. Namun, muntah yang berulang atau disertai gejala lain memerlukan perhatian medis.",
            "Untuk mencegah hairball, sisir bulu kucing secara teratur dan berikan makanan khusus yang membantu mengeluarkan bulu dari sistem pencernaan.",
            "Perhatikan juga pola makan kucing. Makan terlalu cepat dapat menyebabkan muntah. Gunakan slow feeder bowl atau bagi makanan menjadi porsi kecil beberapa kali sehari."
        ]
    },
    { 
        id: 5, 
        title: "Makanan Terbaik untuk Parkit", 
        imageUrl: ":",
        content: [
            "Memilih makanan yang tepat sangat penting untuk memastikan parkit Anda mendapatkan nutrisi yang seimbang dan hidup lebih lama. Parkit memerlukan diet yang bervariasi untuk tetap sehat.",
            "Biji-bijian seperti millet, canary seed, dan oats adalah makanan pokok yang baik. Namun, jangan hanya memberikan biji-bijian saja karena kurang nutrisi lengkap.",
            "Tambahkan sayuran segar seperti wortel, brokoli, dan bayam ke dalam diet parkit. Buah-buahan seperti apel dan pisang juga baik, tetapi dalam jumlah terbatas karena kandungan gulanya.",
            "Hindari memberikan alpukat, cokelat, garam, dan kafein karena sangat beracun untuk burung. Selalu sediakan air bersih dan ganti setiap hari."
        ]
    },
    { 
        id: 6, 
        title: "Mengenal Ras Kura-kura Sulcata", 
        imageUrl: ": ",
        content: [
            "Kura-kura Sulcata adalah salah satu kura-kura terbesar di dunia yang populer sebagai hewan peliharaan karena karakternya yang unik. Mereka berasal dari gurun Sahara di Afrika.",
            "Sulcata dapat tumbuh sangat besar, mencapai berat 90-100 kg dengan panjang cangkang hingga 80 cm. Mereka memerlukan kandang yang sangat luas dengan area outdoor yang aman.",
            "Diet Sulcata terdiri dari rumput, hay, dan sayuran berdaun hijau. Hindari memberikan protein hewani atau buah-buahan terlalu banyak karena dapat menyebabkan masalah kesehatan.",
            "Kura-kura ini sangat kuat dan suka menggali, jadi pastikan kandang mereka memiliki pagar yang tertanam cukup dalam ke tanah. Mereka juga memerlukan akses ke sinar matahari untuk mengatur suhu tubuh."
        ]
    },
    { 
        id: 7, 
        title: "Perawatan Kandang Hamster", 
        imageUrl: ": ",
        content: [
            "Kebersihan kandang adalah kunci untuk menjaga hamster Anda tetap sehat dan bahagia. Ganti alas tidur secara rutin untuk mencegah bau dan penyakit.",
            "Bersihkan kandang hamster minimal seminggu sekali. Buang semua alas tidur yang kotor, cuci kandang dengan sabun ringan, dan keringkan sebelum memasukkan alas tidur baru.",
            "Gunakan alas tidur yang aman untuk hamster seperti aspen shavings atau paper-based bedding. Hindari cedar atau pine shavings karena dapat menyebabkan masalah pernapasan.",
            "Sediakan area yang cukup luas untuk hamster bergerak, bermain, dan berolahraga. Tambahkan wheel, tunnel, dan mainan untuk stimulasi mental dan fisik mereka."
        ]
    },
].map(article => ({
    ...article,
    // Summary100 karakter pertama
    summary: article.content[0].substring(0, 100) + (article.content[0].length > 100 ? '...' : ''),
    // fullContent adalah semua content
    fullContent: article.content
}));

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

// --- Article Detail Modal Component ---
const ArticleModal = ({ article, isOpen, onClose, onNavigate }) => {
    if (!isOpen) return null;

    const defaultPlaceholder = "/images/gambarkucingarticle.png";
    
    // Ambil full content dari artikel, atau fallback ke summary saja jika tidak ada
    const contentSections = article.fullContent || [article.summary];
    
    // Cari index artikel saat ini dalam MOCK_ARTICLES
    const currentArticleIndex = MOCK_ARTICLES.findIndex(a => a.id === article.id);
    const isFirstArticle = currentArticleIndex === 0;
    const isLastArticle = currentArticleIndex === MOCK_ARTICLES.length - 1;
    
    const handleNextArticle = () => {
        if (!isLastArticle) {
            const nextArticle = MOCK_ARTICLES[currentArticleIndex + 1];
            onNavigate(nextArticle);
        }
    };
    
    const handlePrevArticle = () => {
        if (!isFirstArticle) {
            const prevArticle = MOCK_ARTICLES[currentArticleIndex - 1];
            onNavigate(prevArticle);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
            
                {/* Modal Content */}
                <div className="relative z-10 p-8 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between mb-6">
                         <h2 className="text-h-5 font-bold text-accent-neutral-1000">
                                {article.title}
                            </h2>
                            <button 
                             onClick={onClose}
                             aria-label="Close modal"
                            className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md">
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
                                    src={article.imageUrl || defaultPlaceholder}
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = defaultPlaceholder; 
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-2/3 flex flex-col gap-4">
                            

                            <div className="relative bg-white p-8 rounded-lg border-2 border-accent-yellow-300 " >
                                {/* Modal Border SVG */}
                                <ModalDashedBorder className="absolute inset-0 pointer-events-none p-1" />
                                <div className="relative z-10 text-body-2 text-accent-neutral-1000 leading-relaxed space-y-4">
                                    {/* Tampilkan semua konten lengkap */}
                                    {contentSections.map((paragraph, index) => (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
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
                    {/* Divider */}
                    <div className="w-full h-px bg-accent-neutral-200  mt-4" />
                    
                </div>
            </div>
        </div>
    );
};


// --- Article Card Component ---
const ArticleCard = ({ article, onReadClick }) => {
    const defaultPlaceholder = "/images/gambarkucingarticle.png";

    return (
    //    ini card yang bungkus gambar sama tulisannya
   
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden  flex flex-col">
            {/* ini untuk gambar*/}
            <div className="h-40 overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    alt={article.title || "Article image"}
                    src={article.imageUrl || defaultPlaceholder}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = defaultPlaceholder; 
                    }}
                />
            </div>
              
            {/* Content Section - PERBAIKAN: Hapus height tetap, biarkan auto */}
            <div className="relative pt-4 px-4 pb-0 flex flex-col flex-grow ">
                {/* ini tu svg yang garis itu */}
              <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-2"/>

              
                
                {/* isi isi dari card */}
                <div className="relative z-10 flex flex-col gap-1 pt-2 px-2">
                    <p className="text-body-1 font-bold text-accent-neutral-1000 line-clamp-2">
                        {article.title}
                    </p>
                    <div className="w-full h-px bg-accent-neutral-200 mt-1" />
                </div>
                
                <p className="relative z-10 text-body-2 text-accent-neutral-1000 line-clamp-3 px-2 flex-grow">
                    {article.summary}
                </p>

                
               <div className="mt-auto flex justify-end relative z-10  pb-0 pr-0">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={onReadClick}
                      className="rounded-[9px] px-6 py-3 bg-accent-blue-400 border-accent-blue-400 hover:bg-accent-blue-500 active:scale-[0.98] "
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
    const inactiveClasses = "bg-gray-200 text-accent-neutral-1000  border border-text-accent-neutral-1000 disabled:opacity-50 disabled:cursor-not-allowed";

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


// --- Main Application Component (Next.js Page Component) ---
const ArticleCMSApp = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(MOCK_ARTICLES.length / ARTICLES_PER_PAGE);

    const paginatedArticles = MOCK_ARTICLES.slice(
        (currentPage - 1) * ARTICLES_PER_PAGE,
        currentPage * ARTICLES_PER_PAGE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top of the grid on page change for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleReadClick = (article) => {
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


    return (
        <>
            <div className="p-4 sm:p-8 flex justify-center">
                <div className="w-full max-w-6xl flex flex-col items-center gap-10">
     
                    
                    {/* Article Grid */}
                    <div className="w-full grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedArticles.map(article => (
                            <ArticleCard 
                                key={article.id} 
                                article={article}
                                onReadClick={() => handleReadClick(article)}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-3 p-4">
                        {/* Page Numbers */}
                        {renderPaginationButtons()}
                    </div>
                    
                    
                </div>
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <ArticleModal
                    article={selectedArticle}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onNavigate={handleNavigateArticle}
                />
            )}
        </>
    );
};

export default ArticleCMSApp;
