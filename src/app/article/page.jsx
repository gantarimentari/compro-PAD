import Header from "@ds/shared/Header";
import Footer from "@ds/shared/Footer";
import ArticleLayout from "layout/ArticleLayout";
import ArticleCMSApp from "@ds/contents/ArticleCMSApp";

export default function ArticlePage() {
  const svgBackground = "/Background/paw-artikel.svg";
  
  const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen flex flex-col bg-accent-blue-350" style={backgroundStyle}>
      <Header />
      <main className="flex-grow">
        <section className="py-12 text-center">
          <img
            src="/title/TitlePawCare.svg"
            alt="PawCare Title"
            className="mx-auto h-[105px] w-auto"
          />
          <p className="text-h-7 text-white max-w-4xl mx-auto px-4 mt-4">
            Semua yang perlu kamu tahu tentang dunia hewan dan dokter hewan - dari kesehatan, perawatan, hingga cerita inspiratif.
          </p>
        </section>
        <ArticleLayout>
          <ArticleCMSApp />
        </ArticleLayout>
      </main>
      <Footer /> 
    </div>
  );
}