'use client';
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

const backgroundStyle = {
  backgroundImage: "url('/Background/bg-yellow-paw.svg')",
  backgroundPosition: 'center',
};

export default function NotificationPage() {
  return(
    <div className="min-h-screen flex flex-col bg-accent-yellow-350" style={backgroundStyle}>
      <Header />
      <main className="flex-grow relative">
        <section className="sm:py-12 py-4 lg:px-0 px-8 text-center">
           <img
                        src="/title/title-notification.svg"
                        alt="Noticication"
                        className="mx-auto lg:h-[105px] w-[310px] h-auto sm:w-auto"
                    />
          <p className="sm:text-h-7 font-bold text-body-2 text-white max-w-4xl mx-auto lg:px-4 lg:mt-4">
                        Tetap terhubung dengan setiap informasi terbaru yang masuk.
                    </p>
          
        </section>
      </main>
       <Footer footerClass="bg-accent-yellow-600 text-white" />
    </div>
  )
};  