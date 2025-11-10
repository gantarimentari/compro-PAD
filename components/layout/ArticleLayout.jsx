import React from 'react';
import ArticleCMSApp from '@ds/contents/ArticleCMSApp';

/**
 * ArticleLayout - Layout untuk halaman artikel dengan background
 * @param {ReactNode} children - Konten yang akan ditampilkan
 */
export default function ArticleLayout({ children }) {
  const svgBackground = "/Background/bg-article.svg";
  
  const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
    backgroundColor: '#4C8CBA', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div 
      className="min-h-screen w-full py-8"
      style={backgroundStyle}
    >
      <div className="container mx-auto px-4">
        {children}
        <ArticleCMSApp />
      </div>
    </div>
  );
}
