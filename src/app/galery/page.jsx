'use client';

import { useState } from 'react';
import Header from "@ds/layout/Header";
import Footer from "@ds/layout/Footer";
import GaleryLayout from "@ds/layout/Galerylayout";
import { GaleryFilterButtons } from "@ds/contents/GaleryApp";

export default function GaleryPage({ children }) {
    const [activeFilter, setActiveFilter] = useState('all');
    
    const svgBackground = "/Background/bg-greenPaw.svg";
   
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
            <main className="flex-grow relative">
                <section className="py-12 text-center">
                    <img
                        src="/title/title-galery.svg"
                        alt="PawCare Title"
                        className="mx-auto h-[105px] w-auto"
                    />
                    <p className="text-h-7 text-white max-w-4xl mx-auto px-4 mt-4">
                        Abadikan kebahagiaan, keceriaan, dan semangat sehat hewan kesayangan bersama kami!
                    </p>
                    
                    {/* Filter Buttons - Berada di section dengan background paw */}
                    <GaleryFilterButtons 
                        activeFilter={activeFilter} 
                        onFilterChange={handleFilterChange}
                    />
                </section>
                
                <GaleryLayout 
                    activeFilter={activeFilter} 
                    onFilterChange={handleFilterChange}
                />
            </main>

            <Footer footerClass="bg-accent-green-600 text-white" />
        </div>
    );
}