import Header from "@ds/shared/Header";
import Footer from "@ds/shared/Footer";
// import ArticleLayout from "@ds/layout/ArticleLayout";


export default function RootLayout({ children }) {
  //   const svgBackground = "/Background/bg-galery.svg";
  
    
  //   const backgroundStyle = {
  //   backgroundImage: `url('${svgBackground}')`,
  // };
  return (
    <div className="min-h-screen flex flex-col" 
 >
       <Header />
        <main className="flex-grow">
          <p>halo</p>

        </main>
        
        
        <Footer
        footerSvg="/Background/footer-landingPage.svg"
        footerClass="text-white bg-accent-blue-500"
        
      />
    </div>

  );
}