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

