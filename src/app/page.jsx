'use client';

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Profile from '@/components/landing-page/Profile';
import About from '@/components/landing-page/About';
import Content from '@/components/landing-page/Content';
import Sevices from '@/components/landing-page/Services';
import Promo from "@/components/landing-page/Promo";
import Article from "@/components/landing-page/Article";
// import ArticleLayout from "@ds/layout/ArticleLayout";


export default function RootLayout({ children }) {
const svgBackground = "/Background/bg-profile.svg";
const blobSvg = "/Assets/blob.svg";
  
  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-x-hidden bg-white blob-bg-mobile  lg:blob-bg-desktop"
      style={{
        backgroundImage: `url('${blobSvg}'), url('${svgBackground}')`,
        // backgroundSize: '1000px, contain',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
       <Header />
        <main >
          <Profile />
          <Content />
          <About />  
          <Sevices/>
          <Promo />
          <Article />
        </main>
        
        {/* Paw Footer Pattern - positioned above footer */}
        <div className="relative w-full">
          {/* Mobile version - hidden on sm and above */}
          <div 
            className="sm:hidden absolute w-full left-0 z-0"
            style={{
              backgroundImage: 'url(/Assets/paw-footer.svg)',
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 120px', // Mobile: 150px tinggi
              backgroundPosition: 'center top',
              height: '80px', // Mobile: 80px container height
              top: '-45px', // Mobile: -50px offset
            }}
          />
          {/* Desktop version - hidden below sm */}
          <div 
            className="hidden sm:block absolute w-full left-0 z-0"
            style={{
              backgroundImage: 'url(/Assets/paw-footer.svg)',
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 250px', // Desktop: 250px tinggi
              backgroundPosition: 'center top',
              height: '130px', // Desktop: 130px container height
              top: '-90px', // Desktop: -90px offset
            }}
          />
          <Footer
            footerSvg="/Background/bg-bone-blue.svg"
            footerClass="text-white bg-accent-blue-500 relative z-10"
          />
        </div>
      
      
    </div>

  );
}