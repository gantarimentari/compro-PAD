/**
 * UI Icons Component
 * 
 * Component ini menyimpan semua icon UI (location, clock, phone, dll)
 * untuk memudahkan maintenance dan reusability
 * 
 * Usage:
 * import { LocationIcon, ClockIcon, PhoneIcon } from '@ds/icons/UIIcons';
 * <LocationIcon className="w-6 h-6" />
 */

export const LocationIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
// Mengganti nama LogOutDoor menjadi LogOutDoorIcon agar konsisten dengan UserIcon
export const LogOutDoor = ({ 
    className = "w-6 h-6", 
    color = "currentColor", // Digunakan untuk stroke
    fill = "currentColor"   // Ditambahkan untuk mengisi path lingkaran
}) => (
 
   <svg 
     className={className}
     width="20" 
     height="20" 
      viewBox="0 0 24 24" 
      fill="none" // <-- Set fill ke none di SVG root
      xmlns="http://www.w3.org/2000/svg"
   >
      <path 
        d="M16.157 20.517H16.75C17.413 20.517 18.0489 20.2536 18.5178 19.7848C18.9866 19.3159 19.25 18.68 19.25 18.017V5.75C19.25 5.08696 18.9866 4.45107 18.5178 3.98223C18.0489 3.51339 17.413 3.25 16.75 3.25H7.25C6.7 3.25 6.19 3.428 5.777 3.73M5.777 3.73L12.791 7.031C13.0481 7.1523 13.2655 7.34416 13.4177 7.58424C13.57 7.82431 13.6509 8.10271 13.651 8.387V20.246C13.6511 20.4986 13.5873 20.7472 13.4657 20.9686C13.3441 21.19 13.1685 21.3772 12.9552 21.5126C12.742 21.6481 12.498 21.7275 12.2459 21.7434C11.9937 21.7594 11.7416 21.7115 11.513 21.604L5.617 18.829C5.35973 18.7076 5.14228 18.5156 4.99001 18.2753C4.83774 18.0351 4.75693 17.7565 4.757 17.472M5.777 3.73C5.45896 3.96192 5.20017 4.26667 5.02171 4.61751C4.84325 4.96835 4.75015 5.35638 4.75 5.75V17.472" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10.25 14C10.9404 14 11.5 13.4404 11.5 12.75C11.5 12.0596 10.9404 11.5 10.25 11.5C9.55964 11.5 9 12.0596 9 12.75C9 13.4404 9.55964 14 10.25 14Z" 
        fill={fill} // <--- KINI MENGGUNAKAN PROP 'fill' YANG SUDAH DIDEFINISIKAN
      />
    </svg>
);

export const PencilIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg 
      className={className}
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M14.4401 5.78006L4.19808 16.0201C3.89356 16.3245 3.6954 16.719 3.63308 17.1451L3.08008 20.9191L6.85508 20.3661C7.28124 20.3035 7.67581 20.1049 7.98008 19.8001L18.2201 9.56006M14.4401 5.78006L16.6691 3.55006C16.8177 3.40144 16.9941 3.28356 17.1882 3.20313C17.3823 3.1227 17.5904 3.0813 17.8006 3.0813C18.0107 3.0813 18.2188 3.1227 18.413 3.20313C18.6071 3.28356 18.7835 3.40144 18.9321 3.55006L20.4501 5.06806C20.5987 5.21664 20.7166 5.39303 20.797 5.58718C20.8774 5.78132 20.9188 5.98941 20.9188 6.19956C20.9188 6.4097 20.8774 6.61779 20.797 6.81193C20.7166 7.00608 20.5987 7.18248 20.4501 7.33106L18.2201 9.56006M14.4401 5.78006L18.2201 9.56006" 
        stroke={color} // Mengganti stroke="white" menjadi stroke={color}
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

export const ChevronRightIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8.125 3.95837L13.2833 9.11671C13.5174 9.35108 13.6489 9.66879 13.6489 10C13.6489 10.3313 13.5174 10.649 13.2833 10.8834L8.125 16.0417" 
      stroke={color}
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3.95837 8.125L9.11671 13.2833C9.35108 13.5174 9.66879 13.6489 10 13.6489C10.3313 13.6489 10.649 13.5174 10.8834 13.2833L16.0417 8.125" 
      stroke={color}
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const ExternalLinkIcon = ({ 
  className = "w-6 h-6", 
  color = "currentColor", 
  strokeWidth = "1.5", // Mengatur ketebalan garis
  ...props 
}) => (

  <svg 
    className={className} 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props} // Untuk meneruskan props tambahan seperti 'onClick' atau 'id'
  >
    <path 
      d="M5.27142 14.6784L14.6282 5.32161M14.6282 5.32161C14.8545 5.54788 14.9941 5.86077 14.9941 6.2049L14.9941 12.9106M14.6282 5.32161C14.4019 5.09533 14.089 4.95568 13.7449 4.95568L7.03919 4.95568" 
      
 
      stroke={color} 
      
      // Menggunakan prop 'strokeWidth' untuk ketebalan garis
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
export const ChevronLeftIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M11.875 3.95837L6.71667 9.11671C6.48258 9.35108 6.3511 9.66879 6.3511 10C6.3511 10.3313 6.48258 10.649 6.71667 10.8834L11.875 16.0417" 
      stroke={color} // Menggunakan prop color
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
export const PromoIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.7583 3.05489C8.91463 2.88031 9.10601 2.74065 9.31996 2.64503C9.53391 2.54942 9.76563 2.5 9.99997 2.5C10.2343 2.5 10.466 2.54942 10.68 2.64503C10.8939 2.74065 11.0853 2.88031 11.2416 3.05489L11.825 3.70656C11.9917 3.89281 12.1982 4.03917 12.4291 4.13481C12.6601 4.23044 12.9096 4.27291 13.1591 4.25906L14.0341 4.21073C14.2682 4.19782 14.5023 4.23443 14.7212 4.31816C14.9402 4.40189 15.139 4.53085 15.3047 4.69663C15.4704 4.86241 15.5992 5.06128 15.6829 5.28025C15.7665 5.49922 15.803 5.73336 15.79 5.96739L15.7416 6.84156C15.7279 7.091 15.7704 7.34034 15.8661 7.57113C15.9617 7.80192 16.108 8.00826 16.2941 8.17489L16.9458 8.75823C17.1205 8.91455 17.2603 9.10599 17.356 9.32002C17.4517 9.53405 17.5012 9.76586 17.5012 10.0003C17.5012 10.2348 17.4517 10.4666 17.356 10.6806C17.2603 10.8946 17.1205 11.0861 16.9458 11.2424L16.2941 11.8257C16.1079 11.9924 15.9615 12.1989 15.8659 12.4299C15.7703 12.6608 15.7278 12.9103 15.7416 13.1599L15.79 14.0349C15.8029 14.2689 15.7663 14.5031 15.6825 14.722C15.5988 14.9409 15.4698 15.1397 15.3041 15.3054C15.1383 15.4711 14.9394 15.6 14.7204 15.6836C14.5015 15.7672 14.2673 15.8037 14.0333 15.7907L13.1591 15.7424C12.9097 15.7287 12.6604 15.7712 12.4296 15.8668C12.1988 15.9625 11.9924 16.1088 11.8258 16.2949L11.2425 16.9466C11.0861 17.1213 10.8947 17.2611 10.6807 17.3568C10.4666 17.4525 10.2348 17.5019 10.0004 17.5019C9.76594 17.5019 9.53412 17.4525 9.32009 17.3568C9.10606 17.2611 8.91463 17.1213 8.7583 16.9466L8.17497 16.2949C8.00825 16.1086 7.80178 15.9623 7.57083 15.8666C7.33989 15.771 7.09038 15.7285 6.8408 15.7424L5.9658 15.7907C5.73177 15.8036 5.49764 15.767 5.27871 15.6833C5.05978 15.5996 4.86098 15.4706 4.69528 15.3048C4.52957 15.139 4.4007 14.9402 4.31708 14.7212C4.23346 14.5022 4.19696 14.2681 4.20997 14.0341L4.2583 13.1599C4.27203 12.9104 4.2295 12.6611 4.13387 12.4303C4.03823 12.1995 3.89194 11.9932 3.7058 11.8266L3.05414 11.2432C2.87941 11.0869 2.73964 10.8955 2.64394 10.6814C2.54824 10.4674 2.49878 10.2356 2.49878 10.0011C2.49878 9.76669 2.54824 9.53488 2.64394 9.32085C2.73964 9.10682 2.87941 8.91539 3.05414 8.75906L3.7058 8.17573C3.89205 8.00901 4.03841 7.80253 4.13405 7.57159C4.22969 7.34064 4.27215 7.09114 4.2583 6.84156L4.20997 5.96656C4.19719 5.73259 4.23389 5.49855 4.31767 5.27973C4.40145 5.0609 4.53044 4.8622 4.6962 4.69659C4.86197 4.53098 5.0608 4.40218 5.2797 4.31861C5.49861 4.23503 5.73268 4.19856 5.96664 4.21156L6.8408 4.25989C7.09025 4.27362 7.33959 4.23109 7.57038 4.13545C7.80117 4.03982 8.00751 3.89353 8.17414 3.70739L8.7583 3.05489Z" 
    stroke={color} strokeWidth="1.5"/>
    <path d="M7.91663 7.91797H7.92496V7.9263H7.91663V7.91797ZM12.0833 12.0846H12.0916V12.093H12.0833V12.0846Z" 
    stroke={color} strokeWidth="2.25" strokeLinejoin="round"/>
    <path d="M12.5 7.5L7.5 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
export const SettingsIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.05893 3.44712C8.10485 2.96407 8.32921 2.51549 8.68818 2.18902C9.04716 1.86255 9.51495 1.68164 10.0002 1.68164C10.4854 1.68164 10.9532 1.86255 11.3122 2.18902C11.6712 2.51549 11.8955 2.96407 11.9414 3.44712C11.969 3.75916 12.0714 4.05997 12.2399 4.32407C12.4084 4.58817 12.638 4.80779 12.9093 4.96435C13.1807 5.12091 13.4857 5.20979 13.7987 5.22347C14.1116 5.23715 14.4233 5.17523 14.7073 5.04295C15.1482 4.84277 15.6478 4.8138 16.1089 4.96169C16.57 5.10958 16.9596 5.42374 17.2019 5.84304C17.4441 6.26233 17.5217 6.75676 17.4195 7.23009C17.3173 7.70343 17.0426 8.1218 16.6489 8.40378C16.3926 8.58366 16.1833 8.82262 16.0389 9.10047C15.8944 9.37832 15.819 9.68687 15.819 10C15.819 10.3132 15.8944 10.6217 16.0389 10.8996C16.1833 11.1774 16.3926 11.4164 16.6489 11.5963C17.0426 11.8783 17.3173 12.2966 17.4195 12.77C17.5217 13.2433 17.4441 13.7377 17.2019 14.157C16.9596 14.5763 16.57 14.8905 16.1089 15.0384C15.6478 15.1863 15.1482 15.1573 14.7073 14.9571C14.4233 14.8248 14.1116 14.7629 13.7987 14.7766C13.4857 14.7903 13.1807 14.8792 12.9093 15.0357C12.638 15.1923 12.4084 15.4119 12.2399 15.676C12.0714 15.9401 11.969 16.2409 11.9414 16.553C11.8955 17.036 11.6712 17.4846 11.3122 17.8111C10.9532 18.1375 10.4854 18.3184 10.0002 18.3184C9.51495 18.3184 9.04716 18.1375 8.68818 17.8111C8.32921 17.4846 8.10485 17.036 8.05893 16.553C8.03138 16.2408 7.92901 15.9399 7.76049 15.6757C7.59196 15.4115 7.36224 15.1918 7.09079 15.0352C6.81934 14.8786 6.51416 14.7898 6.20108 14.7762C5.88801 14.7626 5.57627 14.8247 5.29227 14.9571C4.85134 15.1573 4.3517 15.1863 3.8906 15.0384C3.42949 14.8905 3.03991 14.5763 2.79767 14.157C2.55543 13.7377 2.47786 13.2433 2.58007 12.77C2.68227 12.2966 2.95693 11.8783 3.3506 11.5963C3.60695 11.4164 3.81621 11.1774 3.96067 10.8996C4.10514 10.6217 4.18056 10.3132 4.18056 10C4.18056 9.68687 4.10514 9.37832 3.96067 9.10047C3.81621 8.82262 3.60695 8.58366 3.3506 8.40378C2.95749 8.12166 2.68331 7.70345 2.58135 7.23044C2.47939 6.75743 2.55694 6.2634 2.79892 5.84438C3.0409 5.42536 3.43003 5.11127 3.89067 4.96315C4.35132 4.81504 4.85059 4.84348 5.29143 5.04295C5.5754 5.17523 5.88705 5.23715 6.20002 5.22347C6.51298 5.20979 6.81804 5.12091 7.08938 4.96435C7.36072 4.80779 7.59034 4.58817 7.75882 4.32407C7.9273 4.05997 8.02967 3.75916 8.05727 3.44712" 
  stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" 
  stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);


export const ClockIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export const PhoneIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export const EmailIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export const MapIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

export const MenuIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export const CloseIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const ArrowRightIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export const CheckIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const SearchIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
export const CloseCircleIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 20 20" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
  
    <path 
      d="M10.0001 17.7083C14.2573 17.7083 17.7084 14.2572 17.7084 9.99996C17.7084 5.74276 14.2573 2.29163 10.0001 2.29163C5.74289 2.29163 2.29175 5.74276 2.29175 9.99996C2.29175 14.2572 5.74289 17.7083 10.0001 17.7083Z" 
    />
    <path d="M7.396 7.39575L12.6043 12.6041M12.6043 7.39575L7.396 12.6041" />
  </svg>
);

export const UserIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
 <svg 
 width="20" 
 height="20" 
 viewBox="0 0 20 20" 
 fill="none" 
 xmlns="http://www.w3.org/2000/svg">
<path d="M15.833 17.2917C16.054 17.2917 16.266 17.2039 16.4223 17.0476C16.5785 16.8913 16.6663 16.6794 16.6663 16.4584V15.42C16.6697 13.0817 13.3547 11.25 9.99967 11.25C6.64467 11.25 3.33301 13.0817 3.33301 15.42V16.4584C3.33301 16.6794 3.42081 16.8913 3.57709 17.0476C3.73337 17.2039 3.94533 17.2917 4.16634 17.2917H15.833ZM13.003 5.71171C13.003 6.10611 12.9253 6.49665 12.7744 6.86103C12.6235 7.22541 12.4022 7.5565 12.1234 7.83538C11.8445 8.11427 11.5134 8.33549 11.149 8.48643C10.7846 8.63736 10.3941 8.71504 9.99967 8.71504C9.60527 8.71504 9.21473 8.63736 8.85035 8.48643C8.48597 8.33549 8.15488 8.11427 7.876 7.83538C7.59711 7.5565 7.37589 7.22541 7.22496 6.86103C7.07402 6.49665 6.99634 6.10611 6.99634 5.71171C6.99634 4.91517 7.31276 4.15126 7.876 3.58803C8.43923 3.0248 9.20314 2.70837 9.99967 2.70837C10.7962 2.70837 11.5601 3.0248 12.1234 3.58803C12.6866 4.15126 13.003 4.91517 13.003 5.71171Z"
 stroke={color}
  strokeWidth="1.5" 
  strokeLinecap="round" 
  strokeLinejoin="round"/>


  </svg>
);


export const BellIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
<svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.55664 17.5C8.70293 17.7533 8.91332 17.9637 9.16668 18.11C9.42003 18.2563 9.70743 18.3333 9.99997 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2.71821 12.772C2.60935 12.8913 2.53751 13.0397 2.51143 13.1991C2.48534 13.3585 2.50615 13.522 2.5713 13.6698C2.63646 13.8176 2.74316 13.9433 2.87843 14.0316C3.01369 14.1198 3.1717 14.1669 3.33321 14.167H16.6665C16.828 14.167 16.9861 14.1202 17.1214 14.0321C17.2568 13.944 17.3636 13.8184 17.429 13.6708C17.4943 13.5231 17.5153 13.3596 17.4894 13.2001C17.4635 13.0407 17.3919 12.8923 17.2832 12.7728C16.1749 11.6303 14.9999 10.4162 14.9999 6.66699C14.9999 5.34091 14.4731 4.06914 13.5354 3.13146C12.5977 2.19378 11.326 1.66699 9.99988 1.66699C8.6738 1.66699 7.40203 2.19378 6.46435 3.13146C5.52666 4.06914 4.99988 5.34091 4.99988 6.66699C4.99988 10.4162 3.82405 11.6303 2.71821 12.772Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
export const NotificationIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
// Export all icons as a map
export const uiIconsMap = {
  location: LocationIcon,
  clock: ClockIcon,
  phone: PhoneIcon,
  email: EmailIcon,
  map: MapIcon,
  menu: MenuIcon,
  close: CloseIcon,
  arrowRight: ArrowRightIcon,
  check: CheckIcon,
  search: SearchIcon,
  user: UserIcon,
  // calendar: CalendarIcon,
  notification: NotificationIcon,
};
export const DocumentIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M7.558 3.75H7.25C6.32174 3.75 5.4315 4.11875 4.77513 4.77513C4.11875 5.4315 3.75 6.32174 3.75 7.25V17.077C3.75 17.9185 4.0843 18.7256 4.67935 19.3207C5.2744 19.9157 6.08147 20.25 6.923 20.25M7.558 3.75V6.192C7.558 6.72243 7.76871 7.23114 8.14379 7.60621C8.51886 7.98129 9.02757 8.192 9.558 8.192H11.904C12.4344 8.192 12.9431 7.98129 13.3182 7.60621C13.6933 7.23114 13.904 6.72243 13.904 6.192V3.75M7.558 3.75H13.904M6.923 20.25V15C6.923 14.2044 7.23907 13.4413 7.80168 12.8787C8.36429 12.3161 9.12735 12 9.923 12H14.077C14.8726 12 15.6357 12.3161 16.1983 12.8787C16.7609 13.4413 17.077 14.2044 17.077 15V20.25M6.923 20.25H17.077M13.904 3.75H13.93C14.3241 3.74995 14.7144 3.82756 15.0785 3.97838C15.4426 4.1292 15.7734 4.35029 16.052 4.629L19.225 7.802C19.55 8.12703 19.8078 8.51289 19.9837 8.93755C20.1595 9.36222 20.25 9.81736 20.25 10.277V17.077C20.25 17.9185 19.9157 18.7256 19.3207 19.3207C18.7256 19.9157 17.9185 20.25 17.077 20.25" 
      stroke={color} // Mengganti stroke="white" menjadi stroke={color}
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const AdminUserIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: color }} 
  >
    <path 
      d="M12.6673 14V12.6667C12.6673 11.9594 12.3864 11.2811 11.8863 10.781C11.3862 10.281 10.7079 10 10.0007 10H6.00065C5.29341 10 4.61513 10.281 4.11503 10.781C3.61494 11.2811 3.33398 11.9594 3.33398 12.6667V14" 
      stroke={color} 
      strokeWidth="1.33333" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    <path 
      d="M8.00065 7.33333C9.47341 7.33333 10.6673 6.13943 10.6673 4.66667C10.6673 3.19391 9.47341 2 8.00065 2C6.52789 2 5.33398 3.19391 5.33398 4.66667C5.33398 6.13943 6.52789 7.33333 8.00065 7.33333Z" 
      stroke={color} 
      strokeWidth="1.33333" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
export const GaleryIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: color }} >
    <path d="M16.941 14.7142C17.0327 14.4092 17.0827 14.085 17.0827 13.75V6.25002C17.0827 5.36597 16.7315 4.51812 16.1064 3.893C15.4813 3.26788 14.6334 2.91669 13.7493 2.91669H6.24935C5.36529 2.91669 4.51745 3.26788 3.89233 3.893C3.2672 4.51812 2.91602 5.36597 2.91602 6.25002V13.8084C2.93131 14.6823 3.28924 15.5152 3.91271 16.1278C4.53618 16.7403 5.37531 17.0835 6.24935 17.0834H13.7493L13.8468 17.0817M16.941 14.7142L16.8677 14.6275L14.8127 12.1475C14.6568 11.9594 14.4614 11.8079 14.2404 11.7036C14.0194 11.5994 13.7782 11.5451 13.5338 11.5444C13.2895 11.5438 13.048 11.5969 12.8265 11.7C12.6049 11.803 12.4088 11.9535 12.2518 12.1409L11.1585 13.4459L10.9802 13.6634M16.941 14.7142C16.7389 15.3836 16.3313 15.9717 15.776 16.3967C15.2207 16.8217 14.5458 17.0614 13.8468 17.0817M10.9802 13.6634L13.7693 16.9934L13.8468 17.0817M10.9802 13.6634L8.29102 10.4525C8.13458 10.2658 7.93913 10.1157 7.71842 10.0127C7.4977 9.90965 7.25709 9.85626 7.01352 9.85626C6.76994 9.85626 6.52933 9.90965 6.30862 10.0127C6.0879 10.1157 5.89245 10.2658 5.73602 10.4525L3.06435 13.6417L2.91685 13.8092" 
    stroke={color} 
    strokeWidth="1.5" 
    strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5742 8.67419C13.2646 8.67419 13.8242 8.11455 13.8242 7.42419C13.8242 6.73384 13.2646 6.17419 12.5742 6.17419C11.8839 6.17419 11.3242 6.73384 11.3242 7.42419C11.3242 8.11455 11.8839 8.67419 12.5742 8.67419Z" fill="white"/>
  </svg>

);
export const AddIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33398 10H10.0007M10.0007 10H16.6673M10.0007 10V3.33334M10.0007 10V16.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

);
export const TrashIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.90518 5.17749L5.66602 15.8133C5.74656 16.3002 5.99734 16.7427 6.37368 17.062C6.75003 17.3813 7.22749 17.5566 7.72102 17.5567H10.511M16.0927 5.17749L14.3327 15.8133C14.2521 16.3002 14.0014 16.7427 13.625 17.062C13.2487 17.3813 12.7712 17.5566 12.2777 17.5567H9.48768M8.35102 9.26332V13.4708M11.6477 9.26332V13.4708M2.29102 5.17749H17.7077M12.3135 5.17749V3.69415C12.3135 3.36263 12.1818 3.04469 11.9474 2.81027C11.713 2.57585 11.395 2.44415 11.0635 2.44415H8.93518C8.60366 2.44415 8.28572 2.57585 8.0513 2.81027C7.81688 3.04469 7.68518 3.36263 7.68518 3.69415V5.17749H12.3135Z" 
    stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

);
export const WarningIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.99935 17.7083C14.2565 17.7083 17.7077 14.2572 17.7077 9.99999C17.7077 5.74279 14.2565 2.29166 9.99935 2.29166C5.74215 2.29166 2.29102 5.74279 2.29102 9.99999C2.29102 14.2572 5.74215 17.7083 9.99935 17.7083Z" stroke="white" strokeWidth="1.5"/>
<path d="M10 9.84415V14.0108" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M9.9987 8.07332C10.574 8.07332 11.0404 7.60695 11.0404 7.03166C11.0404 6.45636 10.574 5.98999 9.9987 5.98999C9.4234 5.98999 8.95703 6.45636 8.95703 7.03166C8.95703 7.60695 9.4234 8.07332 9.9987 8.07332Z" fill="white"/>
</svg>

);

export const UploadIcon= ({className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 16.349V3.87C12.1972 3.87017 12.3923 3.90921 12.5744 3.98488C12.7565 4.06055 12.9218 4.17137 13.061 4.311L17.882 9.132M6.118 9.132L10.939 4.311C11.232 4.018 11.616 3.871 12 3.871M20.75 16.515V17.45C20.75 18.3252 20.4023 19.1646 19.7835 19.7834C19.1646 20.4023 18.3252 20.75 17.45 20.75H6.55C5.67479 20.75 4.83542 20.4023 4.21655 19.7834C3.59768 19.1646 3.25 18.3252 3.25 17.45V16.515" 
stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
export const PenIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.0331 4.81667L3.49807 13.35C3.2443 13.6037 3.07918 13.9325 3.02724 14.2875L2.56641 17.4325L5.71224 16.9717C6.06738 16.9195 6.39618 16.7541 6.64974 16.5L15.1831 7.96667M12.0331 4.81667L13.8906 2.95834C14.0144 2.83449 14.1614 2.73625 14.3232 2.66923C14.485 2.6022 14.6584 2.5677 14.8335 2.5677C15.0086 2.5677 15.182 2.6022 15.3438 2.66923C15.5056 2.73625 15.6526 2.83449 15.7764 2.95834L17.0414 4.22334C17.1653 4.34715 17.2635 4.49415 17.3305 4.65594C17.3975 4.81772 17.432 4.99113 17.432 5.16625C17.432 5.34137 17.3975 5.51478 17.3305 5.67657C17.2635 5.83835 17.1653 5.98535 17.0414 6.10917L15.1831 7.96667M12.0331 4.81667L15.1831 7.96667" 
  stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

);
export const HomeIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V9.16667C2.5 9.6269 2.8731 10 3.33333 10H7.5C7.96024 10 8.33333 9.6269 8.33333 9.16667V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z" 
    stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.666 2.5H12.4993C12.0391 2.5 11.666 2.8731 11.666 3.33333V5.83333C11.666 6.29357 12.0391 6.66667 12.4993 6.66667H16.666C17.1263 6.66667 17.4993 6.29357 17.4993 5.83333V3.33333C17.4993 2.8731 17.1263 2.5 16.666 2.5Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.666 10H12.4993C12.0391 10 11.666 10.3731 11.666 10.8333V16.6667C11.666 17.1269 12.0391 17.5 12.4993 17.5H16.666C17.1263 17.5 17.4993 17.1269 17.4993 16.6667V10.8333C17.4993 10.3731 17.1263 10 16.666 10Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 13.3333H3.33333C2.8731 13.3333 2.5 13.7064 2.5 14.1667V16.6667C2.5 17.1269 2.8731 17.5 3.33333 17.5H7.5C7.96024 17.5 8.33333 17.1269 8.33333 16.6667V14.1667C8.33333 13.7064 7.96024 13.3333 7.5 13.3333Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

);
export const PeopleIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3327 17.5V15.8333C13.3327 14.9493 12.9815 14.1014 12.3564 13.4763C11.7313 12.8512 10.8834 12.5 9.99935 12.5H4.99935C4.11529 12.5 3.26745 12.8512 2.64233 13.4763C2.01721 14.1014 1.66602 14.9493 1.66602 15.8333V17.5" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.334 2.60667C14.0488 2.79198 14.6818 3.20939 15.1337 3.79339C15.5856 4.37739 15.8308 5.09492 15.8308 5.83334C15.8308 6.57177 15.5856 7.28929 15.1337 7.87329C14.6818 8.45729 14.0488 8.8747 13.334 9.06001" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M18.334 17.5V15.8333C18.3334 15.0948 18.0876 14.3773 17.6351 13.7936C17.1826 13.2099 16.5491 12.793 15.834 12.6083" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.49935 9.16667C9.3403 9.16667 10.8327 7.67428 10.8327 5.83333C10.8327 3.99238 9.3403 2.5 7.49935 2.5C5.6584 2.5 4.16602 3.99238 4.16602 5.83333C4.16602 7.67428 5.6584 9.16667 7.49935 9.16667Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

)
;
export const DogIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.375 13.5417H10.625L10 14.1667L9.375 13.5417Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.334 11.6667V12.0833" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M3.68399 9.3725C3.45077 10.2731 3.33315 11.1997 3.33399 12.13C3.33399 15.6067 6.31899 17.5 10.0007 17.5C13.6823 17.5 16.6673 15.6067 16.6673 12.13C16.6632 11.1959 16.5248 10.2672 16.2565 9.3725" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.66602 11.6667V12.0833" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.08381 7.08333C6.76381 7.95833 6.18131 8.77333 5.13047 9.16666C3.52131 9.76833 2.15047 8.91916 2.08381 8.33333C1.98964 7.50499 3.06464 2.89166 5.41714 2.49999C7.01964 2.23249 8.45964 3.20416 8.45964 4.36249C9.51363 4.09481 10.6192 4.10687 11.6671 4.39749C11.6671 3.23916 13.2038 2.23249 14.8063 2.49999C17.1588 2.89166 18.2338 7.50499 18.1396 8.33333C18.073 8.91916 16.7021 9.76833 15.093 9.16666C14.0421 8.77333 13.5471 7.95833 13.2271 7.08333" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
export const PawIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_216_10853)">
<path d="M9.16667 5.00001C10.0871 5.00001 10.8333 4.25381 10.8333 3.33334C10.8333 2.41286 10.0871 1.66667 9.16667 1.66667C8.24619 1.66667 7.5 2.41286 7.5 3.33334C7.5 4.25381 8.24619 5.00001 9.16667 5.00001Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.0007 8.33333C15.9211 8.33333 16.6673 7.58714 16.6673 6.66667C16.6673 5.74619 15.9211 5 15.0007 5C14.0802 5 13.334 5.74619 13.334 6.66667C13.334 7.58714 14.0802 8.33333 15.0007 8.33333Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16.6667 15C17.5871 15 18.3333 14.2538 18.3333 13.3333C18.3333 12.4129 17.5871 11.6667 16.6667 11.6667C15.7462 11.6667 15 12.4129 15 13.3333C15 14.2538 15.7462 15 16.6667 15Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.50012 8.33333C8.04729 8.33333 8.58911 8.4411 9.09463 8.6505C9.60015 8.85989 10.0595 9.16681 10.4464 9.55372C10.8333 9.94063 11.1402 10.4 11.3496 10.9055C11.559 11.411 11.6668 11.9528 11.6668 12.5V15.4167C11.6666 16.1137 11.4167 16.7876 10.9625 17.3164C10.5082 17.8451 9.87966 18.1937 9.19061 18.2989C8.50155 18.4042 7.79758 18.2592 7.20619 17.8902C6.61481 17.5213 6.17513 16.9527 5.96678 16.2875C5.61123 15.1403 4.86123 14.3889 3.71678 14.0333C3.05194 13.8251 2.48359 13.3857 2.11458 12.7948C1.74558 12.2039 1.6003 11.5003 1.70502 10.8116C1.80975 10.1228 2.15757 9.49424 2.68554 9.03967C3.21351 8.58511 3.88676 8.33455 4.58345 8.33333H7.50012Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_216_10853">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>

);
export const DiskSaveIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.29833 3.125H6.04167C5.26812 3.125 4.52625 3.43229 3.97927 3.97927C3.43229 4.52625 3.125 5.26812 3.125 6.04167V14.2308C3.125 14.9321 3.40358 15.6047 3.89946 16.1005C4.39534 16.5964 5.06789 16.875 5.76917 16.875M6.29833 3.125V5.16C6.29833 5.60203 6.47393 6.02595 6.78649 6.33851C7.09905 6.65107 7.52297 6.82667 7.965 6.82667H9.92C10.362 6.82667 10.786 6.65107 11.0985 6.33851C11.4111 6.02595 11.5867 5.60203 11.5867 5.16V3.125M6.29833 3.125H11.5867M5.76917 16.875V12.5C5.76917 11.837 6.03256 11.2011 6.5014 10.7322C6.97024 10.2634 7.60613 10 8.26917 10H11.7308C12.3939 10 13.0298 10.2634 13.4986 10.7322C13.9674 11.2011 14.2308 11.837 14.2308 12.5V16.875M5.76917 16.875H14.2308M11.5867 3.125H11.6083C11.9368 3.12496 12.262 3.18963 12.5654 3.31532C12.8688 3.441 13.1445 3.62524 13.3767 3.8575L16.0208 6.50167C16.2917 6.77253 16.5065 7.09408 16.6531 7.44796C16.7996 7.80185 16.875 8.18113 16.875 8.56417V14.2308C16.875 14.9321 16.5964 15.6047 16.1005 16.1005C15.6047 16.5964 14.9321 16.875 14.2308 16.875" 
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

);


export const CalendarIcon =({ className = "w-6 h-6", color = "currentColor" }) => (
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.66602 1.66667V5.00001" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.334 1.66667V5.00001" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.8333 3.33333H4.16667C3.24619 3.33333 2.5 4.07952 2.5 4.99999V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V4.99999C17.5 4.07952 16.7538 3.33333 15.8333 3.33333Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2.5 8.33334H17.5" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);

export const JarumSuntikIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
{/* <g clip-path="url(#clip0_2541_6753)"> */}
<path d="M15 1.66699L18.3333 5.00033" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14.167 5.83301L16.667 3.33301" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.8337 7.50033L7.25033 16.0837C6.41699 16.917 5.16699 16.917 4.41699 16.0837L3.91699 15.5837C3.08366 14.7503 3.08366 13.5003 3.91699 12.7503L12.5003 4.16699" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.5 9.16699L10.8333 12.5003" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4.16699 15.833L1.66699 18.333" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.667 3.33301L16.667 8.33301" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
{/* </g> */}
{/* <defs>
<clipPath id="clip0_2541_6753">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs> */}
</svg>

);
export const NoteIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5003 1.66699H7.50033C7.04009 1.66699 6.66699 2.04009 6.66699 2.50033V4.16699C6.66699 4.62723 7.04009 5.00033 7.50033 5.00033H12.5003C12.9606 5.00033 13.3337 4.62723 13.3337 4.16699V2.50033C13.3337 2.04009 12.9606 1.66699 12.5003 1.66699Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.333 3.33301H14.9997C15.4417 3.33301 15.8656 3.5086 16.1782 3.82116C16.4907 4.13372 16.6663 4.55765 16.6663 4.99967V16.6663C16.6663 17.1084 16.4907 17.5323 16.1782 17.8449C15.8656 18.1574 15.4417 18.333 14.9997 18.333H4.99967C4.55765 18.333 4.13372 18.1574 3.82116 17.8449C3.5086 17.5323 3.33301 17.1084 3.33301 16.6663V4.99967C3.33301 4.55765 3.5086 4.13372 3.82116 3.82116C4.13372 3.5086 4.55765 3.33301 4.99967 3.33301H6.66634" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 9.16699H13.3333" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 13.333H13.3333" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.66699 9.16699H6.67533" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.66699 13.333H6.67533" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);

export const FileIcon= ({ className = "w-6 h-6", color = "currentColor" })=> (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5007 1.66666H5.00065C4.55862 1.66666 4.1347 1.84225 3.82214 2.15481C3.50958 2.46737 3.33398 2.8913 3.33398 3.33332V16.6667C3.33398 17.1087 3.50958 17.5326 3.82214 17.8452C4.1347 18.1577 4.55862 18.3333 5.00065 18.3333H15.0007C15.4427 18.3333 15.8666 18.1577 16.1792 17.8452C16.4917 17.5326 16.6673 17.1087 16.6673 16.6667V5.83332L12.5007 1.66666Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.666 1.66666V4.99999C11.666 5.44202 11.8416 5.86594 12.1542 6.1785C12.4667 6.49106 12.8907 6.66666 13.3327 6.66666H16.666" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8.33268 7.5H6.66602" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.3327 10.8333H6.66602" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.3327 14.1667H6.66602" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);

export const DBHomeIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V9.16667C2.5 9.6269 2.8731 10 3.33333 10H7.5C7.96024 10 8.33333 9.6269 8.33333 9.16667V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z" 
stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16.667 2.5H12.5003C12.0401 2.5 11.667 2.8731 11.667 3.33333V5.83333C11.667 6.29357 12.0401 6.66667 12.5003 6.66667H16.667C17.1272 6.66667 17.5003 6.29357 17.5003 5.83333V3.33333C17.5003 2.8731 17.1272 2.5 16.667 2.5Z" 
stroke={color}strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16.667 10H12.5003C12.0401 10 11.667 10.3731 11.667 10.8333V16.6667C11.667 17.1269 12.0401 17.5 12.5003 17.5H16.667C17.1272 17.5 17.5003 17.1269 17.5003 16.6667V10.8333C17.5003 10.3731 17.1272 10 16.667 10Z" 
stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.5 13.333H3.33333C2.8731 13.333 2.5 13.7061 2.5 14.1663V16.6663C2.5 17.1266 2.8731 17.4997 3.33333 17.4997H7.5C7.96024 17.4997 8.33333 17.1266 8.33333 16.6663V14.1663C8.33333 13.7061 7.96024 13.333 7.5 13.333Z" 
stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

)

export const HouseIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 24.5V15.1667C17.5 14.8572 17.3771 14.5605 17.1583 14.3417C16.9395 14.1229 16.6428 14 16.3333 14H11.6667C11.3572 14 11.0605 14.1229 10.8417 14.3417C10.6229 14.5605 10.5 14.8572 10.5 15.1667V24.5" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M3.5 11.6669C3.49992 11.3275 3.57389 10.9921 3.71675 10.6842C3.85962 10.3763 4.06793 10.1033 4.32717 9.88423L12.4938 2.88423C12.915 2.52829 13.4486 2.33301 14 2.33301C14.5514 2.33301 15.085 2.52829 15.5062 2.88423L23.6728 9.88423C23.9321 10.1033 24.1404 10.3763 24.2832 10.6842C24.4261 10.9921 24.5001 11.3275 24.5 11.6669V22.1669C24.5 22.7857 24.2542 23.3792 23.8166 23.8168C23.379 24.2544 22.7855 24.5002 22.1667 24.5002H5.83333C5.21449 24.5002 4.621 24.2544 4.18342 23.8168C3.74583 23.3792 3.5 22.7857 3.5 22.1669V11.6669Z" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);

// Dashboard Icons
export const TotalHewanIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TotalKunjunganIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const KunjunganBaruIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RekamMedisIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12H18L15 21L9 3L6 12H2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WaveHandIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 11.5C7 11.5 7.5 10.5 9 10.5C10.5 10.5 11 11.5 11 11.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 11.5C13 11.5 13.5 10.5 15 10.5C16.5 10.5 17 11.5 17 11.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 8C8 8 9 7 10 7C11 7 12 8 12 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8C12 8 13 7 14 7C15 7 16 8 16 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const RightArrowIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.27142 14.6784L14.6282 5.32161M14.6282 5.32161C14.8545 5.54789 14.9941 5.86078 14.9941 6.20491L14.9941 12.9106M14.6282 5.32161C14.4019 5.09534 14.089 4.95568 13.7449 4.95568L7.03919 4.95569" 
stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
export const CheckCircleIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.99984 17.7087C14.257 17.7087 17.7082 14.2575 17.7082 10.0003C17.7082 5.74313 14.257 2.29199 9.99984 2.29199C5.74264 2.29199 2.2915 5.74313 2.2915 10.0003C2.2915 14.2575 5.74264 17.7087 9.99984 17.7087Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M13.6457 7.66211L8.96984 12.3388L6.354 9.72711" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
export const RetryIcon = ({ className = "w-6 h-6", color='currentColor' }) => (
  <svg width="16" className={className} height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 8C14 9.18669 13.6481 10.3467 12.9888 11.3334C12.3295 12.3201 11.3925 13.0892 10.2961 13.5433C9.19975 13.9974 7.99335 14.1162 6.82946 13.8847C5.66558 13.6532 4.59648 13.0818 3.75736 12.2426C2.91825 11.4035 2.3468 10.3344 2.11529 9.17054C1.88378 8.00666 2.0026 6.80026 2.45673 5.7039C2.91085 4.60754 3.67989 3.67047 4.66658 3.01118C5.65328 2.35189 6.81331 2 8 2C9.68 2 11.2867 2.66667 12.4933 3.82667L14 5.33333" 
stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.9998 2V5.33333H10.6665" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>




);
export const HistoryIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 8C2 9.18669 2.35189 10.3467 3.01118 11.3334C3.67047 12.3201 4.60754 13.0892 5.7039 13.5433C6.80026 13.9974 8.00666 14.1162 9.17054 13.8847C10.3344 13.6532 11.4035 13.0818 12.2426 12.2426C13.0818 11.4035 13.6532 10.3344 13.8847 9.17054C14.1162 8.00666 13.9974 6.80026 13.5433 5.7039C13.0892 4.60754 12.3201 3.67047 11.3334 3.01118C10.3467 2.35189 9.18669 2 8 2C6.32263 2.00631 4.71265 2.66082 3.50667 3.82667L2 5.33333" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2 2V5.33333H5.33333" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8 4.66699V8.00033L10.6667 9.33366" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
export const CalenderCheckIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
{/* <g clip-path="url(#clip0_2706_35797)"> */}
<path d="M3.33301 0.833008V2.49967" stroke={color} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.6665 0.833008V2.49967" stroke={color} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.91667 1.66699H2.08333C1.6231 1.66699 1.25 2.04009 1.25 2.50033V8.33366C1.25 8.7939 1.6231 9.16699 2.08333 9.16699H7.91667C8.3769 9.16699 8.75 8.7939 8.75 8.33366V2.50033C8.75 2.04009 8.3769 1.66699 7.91667 1.66699Z" stroke={color} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.25 4.16699H8.75" stroke={color} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M3.75 6.66634L4.58333 7.49967L6.25 5.83301" stroke={color} strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
{/* </g> */}
{/* <defs>
<clipPath id="clip0_2706_35797">
<rect width="10" height="10" fill="white"/>
</clipPath>
</defs> */}
</svg>


);
export const SendIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.2998 10.0003H5.69316C5.69316 9.77109 5.64566 9.54193 5.5515 9.32693L3.57066 4.84526C2.93733 3.41193 4.45233 1.97693 5.849 2.68609L17.3332 8.51443C18.5498 9.13109 18.5498 10.8694 17.3332 11.4861L5.84983 17.3144C4.45233 18.0236 2.93733 16.5878 3.57066 15.1553L5.54983 10.6736C5.64337 10.4614 5.69162 10.2321 5.6915 10.0003" 
stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);
