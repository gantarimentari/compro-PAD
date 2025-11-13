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


export const CalendarIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
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
  calendar: CalendarIcon,
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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 16.349V3.87C12.1972 3.87017 12.3923 3.90921 12.5744 3.98488C12.7565 4.06055 12.9218 4.17137 13.061 4.311L17.882 9.132M6.118 9.132L10.939 4.311C11.232 4.018 11.616 3.871 12 3.871M20.75 16.515V17.45C20.75 18.3252 20.4023 19.1646 19.7835 19.7834C19.1646 20.4023 18.3252 20.75 17.45 20.75H6.55C5.67479 20.75 4.83542 20.4023 4.21655 19.7834C3.59768 19.1646 3.25 18.3252 3.25 17.45V16.515" 
stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_216_10853)">
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


