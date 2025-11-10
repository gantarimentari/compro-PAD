import Header from "@ds/layout/Header";
import Footer from "@ds/layout/Footer";
import  UserProfile  from "@ds/contents/UserProfile";
// import ArticleLayout from "@ds/layout/ArticleLayout";


export default function RootLayout({ children }) {
    const svgBackground = "/Background/bg-paw-profile.svg";
  
    
    const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
  };
  return (
    <div className="min-h-screen flex flex-col" style={backgroundStyle}
 >
       <Header />
        <main className="flex-grow relative">
          <UserProfile />
        </main>
        
        
        <Footer
        footerClass="text-white bg-accent-blue-600"
        
      />
    </div>

  );
}