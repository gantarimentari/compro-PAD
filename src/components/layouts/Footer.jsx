"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "@/components/icons";
import { socialIconsMap } from "@/components/icons";
import systemInfoService from '@/lib/services/systemInfoService';
import {defaultData} from './dummyData';
export default function Footer({
  footerClass = "bg-accent-blue-600 text-white",
  footerStyle = null,
  footerSvg = null,
}) {

  const{ data, isLoading} = useQuery({
    queryKey: ['footerData'],
    queryFn: async () => {
      console.log("🔄 Fetching footer data via TanStack Query...");
      const response = await systemInfoService.get();
      console.log("✅ Footer data loaded:", response.systemInfo);

      return {
        ...defaultData,
        ...response.systemInfo
      };
    },
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000,
    enabled: typeof window !== 'undefined',
  });
  const footer = data || defaultData;

  const svgStyle = footerSvg
    ? {
        backgroundImage: `url(${footerSvg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", // atau "contain" tergantung kebutuhan
        backgroundPosition: "center",
      }
    : {};

  const combinedStyle = { ...svgStyle, ...(footerStyle || {}) };

  return (
    <footer
      className={`${footerClass} w-full pt-12 md:pt-16 lg:pt-20 pb-6`}
      style={combinedStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Main Content - Contact Info & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column: Contact Information */}
          <div className="flex flex-col items-start gap-6">
            {/* Clinic Name */}
            <h3 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tight break-words whitespace-normal max-w-full">
              {footer.clinic_name}
            </h3>

              {/* Contact Details */}
              <div className="flex flex-col items-start gap-4 w-full">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <Icons.LocationIcon className="w-6 h-6 shrink-0 mt-0.5" />
                  {isLoading ? (
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/20 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse"></div>
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-white/90 leading-relaxed">
                      {footer.address}
                    </p>
                  )}
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3">
                  <Icons.ClockIcon className="w-6 h-6 shrink-0" />
                  {isLoading ? (
                    <div className="h-4 bg-white/20 rounded w-48 animate-pulse"></div>
                  ) : (
                    <p className="text-sm md:text-base text-white/90">
                      {footer.operating_hours}
                    </p>
                  )}
                </div>

                {/* Phone */}
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Icons.PhoneIcon className="w-6 h-6 shrink-0" />
                    <div className="h-4 bg-white/20 rounded w-36 animate-pulse"></div>
                  </div>
                ) : (
                  <Link
                    href={`tel:${(footer.phone || "").replace(/[^0-9+]/g, "")}`}
                    className="flex items-center gap-3 hover:text-accent-yellow-300 transition-colors"
                  >
                    <Icons.PhoneIcon className="w-6 h-6 shrink-0" />
                    <span className="text-sm md:text-base font-medium">
                      {footer.phoneDisplay || footer.phone}
                    </span>
                  </Link>
                )}
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 mt-2">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 md:w-11 md:h-11 bg-white/20 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </>
                ) : (
                  footer.socialMedia?.map((social, index) => {
                    const IconComponent = socialIconsMap[social.icon.toLowerCase()];
                    return (
                      <Link
                        key={`${social.icon}-${index}`}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-lg flex items-center justify-center text-accent-blue-600 hover:bg-accent-yellow-300 hover:text-accent-blue-600 duration-300 hover:shadow-md"
                        aria-label={`Visit our ${social.name}`}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Map */}
            <div className="w-full">
              {isLoading ? (
                <div className="w-full h-[280px] md:h-[320px] lg:h-[340px] bg-white/20 rounded animate-pulse"></div>
              ) : footer.mapEmbedUrl && footer.mapEmbedUrl.trim() !== "" ? (
                <>
                  <div className="w-full h-[280px] md:h-[320px] lg:h-[340px] overflow-hidden shadow-e3 rounded">
                    <iframe
                      src={footer.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Lokasi ${footer.clinic_name}`}
                      className="w-full h-full"
                    />
                  </div>
                  {footer.mapLink && footer.mapLink.trim() !== "" && (
                    <div className="mt-2 text-right">
                      <a
                        href={footer.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium underline text-white/90 hover:text-accent-yellow-300 transition-colors"
                      >
                        View full map
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-[280px] md:h-[320px] lg:h-[340px] bg-white/10 rounded flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <Icons.LocationIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">
                      Map location not available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div> {/* ✅ Close grid columns */}

          {/* ✅ Copyright Section - PINDAHKAN KELUAR dari grid */}
          <div className="mt-12 md:mt-14 pt-6">
            <div className="text-center text-sm md:text-base font-semibold text-white">
              {isLoading ? (
                <div className="h-5 bg-white/20 rounded w-64 mx-auto animate-pulse"></div>
              ) : (
                `${footer.judul_footer || ""}`
              )}
            </div>
          </div>
        </div>
    </footer>
  );
}