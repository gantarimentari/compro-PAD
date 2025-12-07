import Header from "@ds/shared/Header";
import Footer from "@ds/shared/Footer";
import Profile from '@layout/landingPage/Profile';
import About from '@layout/landingPage/About';
import Content from '@layout/landingPage/Content';
import Sevices from '@layout/landingPage/Services';
import Promo from "@layout/landingPage/Promo";
import Article from "@layout/landingPage/Article";
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
          <div 
            className="absolute w-full left-0 z-0"
            style={{
              backgroundImage: 'url(/Assets/paw-footer.svg)',
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 250px', // auto untuk lebar (mempertahankan aspect ratio), 100px untuk tinggi
              backgroundPosition: 'center top',
              height: '130px',
              top: '-90px', // Nilai NEGATIF untuk naik ke atas footer. Semakin kecil (lebih negatif) = lebih turun, semakin besar (mendekati 0) = lebih naik
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