'use client';

import { useState } from 'react';
import Header from "@ds/shared/Header";
import Footer from "@ds/shared/Footer";
import GaleryLayout from "layout/Galerylayout";
import { GaleryFilterButtons } from "@ds/contents/GaleryApp";
import GaleryApp from '@ds/contents/GaleryApp';

export default function GaleryPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    
    const svgBackground = "/Background/bg-green-paw.svg";
   
    const backgroundStyle = {
        backgroundImage: `url('${svgBackground}')`,
        backgroundPosition: 'center',
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    return (
        <div className="min-h-screen flex flex-col bg-accent-green-350" style={backgroundStyle}>
            <Header />
            
            {/* Main content with background and overlay */}
            <main className=" flex-grow relative">
                <section className="sm:py-12 py-4 lg:px-0 px-8 text-center">
                    <img
                        src="/title/title-galery.svg"
                        alt="PawCare Title"
                        className="mx-auto lg:h-[105px] w-[310px] h-auto sm:w-auto"
                    />
                    <p className="sm:text-h-7 text-body-2 text-white max-w-4xl mx-auto lg:px-4 lg:mt-4">
                        Abadikan kebahagiaan, keceriaan, dan semangat sehat hewan kesayangan bersama kami!
                    </p>
                    
                    {/* Filter Buttons - Berada di section dengan background paw */}
                    <GaleryFilterButtons 
                        activeFilter={activeFilter} 
                        onFilterChange={handleFilterChange}
                    />
                </section>
                
                <GaleryLayout> 
                    <GaleryApp 
                        activeFilter={activeFilter} 
                    />
                </GaleryLayout>
            </main>

            <Footer footerClass="bg-accent-green-600 text-white" />
        </div>
    );
}