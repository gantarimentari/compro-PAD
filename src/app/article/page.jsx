import Header from "@ds/shared/Header";
import Footer from "@ds/shared/Footer";
import ArticleLayout from "layout/ArticleLayout";
import ArticleCMSApp from "@ds/contents/ArticleCMSApp";

export default function ArticlePage() {
  const svgBackground = "/Background/bg-blue-paw.svg"
  
  const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen flex flex-col bg-accent-blue-350" style={backgroundStyle}>
      <Header />
      <main className="flex-grow relative">
        <section className="sm:py-12 py-4 lg:px-0 px-8 text-center ">
          <img
            src="/title/TitlePawCare.svg"
            alt="PawCare Title"
            className="mx-auto lg:h-[105px] w-[310px] h-auto sm:w-auto"
          />
          <p className="sm:text-h-7 mt-2 text-body-2 text-white max-w-4xl mx-auto lg:px-4 lg:mt-4">
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