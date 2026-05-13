'use client';

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { SearchIcon } from '@/components/icons';
import {useFaq} from "@/components/dashboard/faq/hooks/useFaq";
import {useState} from "react";
import React from "react";
import FaqItem from "./_components/FaqItem";


const backgroundStyle = {
  backgroundImage: "url('/Background/bg-yellow-paw.svg')",
  backgroundPosition: 'center',
};

export default function FAQPage(question, answer) {
  const {faqs, isLoading, searchTerm, setSearchTerm} = useFaq({ publicOnly: true });
  const leftColumn = faqs.filter((_, i) => i % 2 === 0);
  const rightColumn = faqs.filter((_, i) => i % 2 !== 0);
  
  return (
    <div className="min-h-screen flex flex-col bg-accent-yellow-350" style={backgroundStyle}>
      <Header />

      <main className="flex-grow relative">  
             <section className="sm:py-12 py-4 lg:px-0 px-8 text-center">
         <img
        src="/title/title-faq.svg"
        alt="FAQ"
        className="mx-auto lg:h-[105px] w-[310px] h-auto sm:w-auto lg:mt-12"
        />
        <p className="sm:text-h-7 font-bold text-body-2 text-white max-w-4xl mx-auto lg:px-4 lg:mt-4">
          Dapatkan informasi tentang hal-hal yang mungkin Pawrents belum pahami
        </p>
      </section>
      <SectionWrapper bgImage="/Background/bg-bone-orange.svg">
        <div className="max-w-4xl mx-auto py-12 px-4 lg:min-h-[600px] ">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white font-medium">Loading...</p>
            </div>
          ) : (
                      <div>
            <div className="flex items-center justify-center py-4">
              <div className=" relative max-w-4xl w-full">
                        <div className="absolute inset-y-0 left-0 flex pl-3 items-center pointer-events-none">
                            <SearchIcon color="#FFAB2F" />
                        </div>
                        <input
                            type="search"
                            placeholder="Cari Pertanyaan Terkait..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)  }
                            className="focus:outline-none w-full pl-10 text-body-2 text-accent-neutral-800 pr-4 py-3 
                                       bg-white rounded-md transition duration-150"
                        />
                    </div>
            </div>
            
                          <div className="flex flex-col rounded-md md:flex-row md:gap-6 bg-white">
              <div className="flex flex-col md:flex-row lg:gap-6 p-6 w-full" >
                          {/* Kolom Kiri */}
            <div className="flex-1 w-full">
              {leftColumn.map((item, index) => (
                <FaqItem key={`left-${index}`} question={item.question} answer={item.answer} />
              ))}
            </div>
            {/* Kolom Kanan */}
            <div className="flex-1 w-full">
              {rightColumn.map((item, index) => (
                <FaqItem key={`right-${index}`} question={item.question} answer={item.answer} />
              ))}
            </div>
              </div>
          </div>
          </div>


          )}

        </div>
      </SectionWrapper>
      </main>
      <Footer footerClass="bg-accent-yellow-600 text-white" />
    </div>
  );
};