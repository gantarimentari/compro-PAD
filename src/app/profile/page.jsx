import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import  UserProfile  from "@/components/profile/UserProfile";
// import ArticleLayout from "@ds/layout/ArticleLayout";


export default function RootLayout({ children }) {
    const svgBackground = "/Background/bg-paw-profile.svg";
    const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
  };
  return (
    <div className="min-h-screen flex flex-col" style={backgroundStyle}>
      

   
       <Header />
        <main className="flex-grow relative">
          <UserProfile
           />
        </main>
        
        <div>
       
       <Footer
        footerClass="text-white bg-accent-blue-600"
        
      />

        </div>
       
    </div>

  );
}