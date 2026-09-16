import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Royal King's Crown Icon
export const CrownIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M5 19h14a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1zm14.8-12.7c-.5-.4-1.3-.3-1.7.2L15 10.3l-2.4-5.3c-.3-.7-1-.9-1.6-.6-.2.1-.4.3-.5.6L8 10.3 4.9 6.5c-.4-.5-1.2-.6-1.7-.2-.5.4-.6 1.2-.2 1.7l3 6c.2.4.6.6 1 .6h10c.4 0 .8-.2 1-.6l3-6c.4-.5.3-1.3-.2-1.7z" />
  </svg>
);

// 2. All Menu Grid / Booklet Icon
export const AllMenuIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

// 3. Soup Icon - Steaming hot aromatic soup bowl
export const SoupIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12h16c0 4.418-3.582 8-8 8s-8-3.582-8-8z" />
    <path d="M3 12h18" />
    <path d="M8 8c0-1.5 1-2.5 1-4" />
    <path d="M12 7c0-1.5 1-2.5 1-4" />
    <path d="M16 8c0-1.5 1-2.5 1-4" />
    <path d="M9 20h6" />
  </svg>
);

// 4. Fresh Harvest / Salad Icon - Healthy bowl with fresh greens
export const FreshHarvestIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 13h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z" />
    <path d="M3.5 13h17" />
    <path d="M12 5c-2.5 1-3.5 3.5-3.5 6" />
    <path d="M12 5c2.5 1 3.5 3.5 3.5 6" />
    <path d="M12 5v6" />
    <path d="M8 8c-1.5.5-2.5 2-2.5 4" />
    <path d="M16 8c1.5.5 2.5 2 2.5 4" />
    <path d="M9 21h6" />
  </svg>
);

// 5. Appetizers Icon - Skewer / Starter bites platter
export const AppetizersIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l6.5-6.5" />
    <circle cx="11.5" cy="12.5" r="2.5" />
    <circle cx="16" cy="8" r="2.5" />
    <path d="M18 6l3-3" />
    <path d="M14.5 15.5l5.5 5.5" />
    <path d="M17 18l3 3" />
  </svg>
);

// 6. King's Special Seafood Icon - Royal Prawn / Shrimp
export const SeafoodIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 10c0-3.3-2.7-6-6-6-3.9 0-7 3.1-7 7 0 2.2 1 4.2 2.6 5.5" />
    <path d="M12 4c2.2 0 4 1.8 4 4 0 2.2-1.8 4-4 4-2.8 0-5 2.2-5 5 0 .8.2 1.6.6 2.3" />
    <path d="M18 10c1.5.5 3 .2 3.5-1s-.2-2.5-1.5-3" />
    <path d="M19.5 6c.8-1 1.5-2.5 1.5-3.5" />
    <path d="M7 16.5c-1 .8-1.5 2-1.5 3.2 0 1.2.9 2.3 2 2.3.8 0 1.6-.5 2-1.2" />
    <circle cx="14" cy="7" r="1" fill="currentColor" />
  </svg>
);

// 7. Asian Mains Icon - Wok / Noodle bowl with chopsticks
export const AsianMainsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z" />
    <path d="M3 12h18" />
    <path d="M19 4L7 12" />
    <path d="M21 6L9 14" />
    <path d="M9 20h6" />
  </svg>
);

// 8. Pasta & Risotto Icon - Italian pasta plate with swirl
export const PastaIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="13" rx="9" ry="6" />
    <ellipse cx="12" cy="13" rx="5" ry="3" />
    <path d="M12 4v4" />
    <path d="M9 4.5v3" />
    <path d="M15 4.5v3" />
  </svg>
);

// 9. Mains Icon - Royal chef's covered cloche dome
export const MainsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 18h18" />
    <path d="M4 18c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    <path d="M12 10V8" />
    <circle cx="12" cy="7" r="1.5" />
    <path d="M2 19h20v1H2z" fill="currentColor" />
  </svg>
);

// 10. Indian Mains Icon - Traditional royal handi / curry pot
export const IndianMainsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 9h14" />
    <path d="M6 9c0 5 2.7 9 6 9s6-4 6-9" />
    <path d="M3 10c0 1.5 1.5 2 3 2" />
    <path d="M21 10c0 1.5-1.5 2-3 2" />
    <path d="M9 6c0-1.5 1-2.5 1-3" />
    <path d="M14 6c0-1.5 1-2.5 1-3" />
    <path d="M8 20h8" />
  </svg>
);

// 11. Noodle & Rice Icon - Noodle bowl with rising steam
export const NoodleRiceIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 11h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z" />
    <path d="M3 11h18" />
    <path d="M8 7c0 2 1 2 2 4" />
    <path d="M12 6c0 2 1 3 1 5" />
    <path d="M16 7c0 2-1 2-2 4" />
    <path d="M9 19h6" />
  </svg>
);

// 12. Assorted Breads Icon - Roti / Naan slices
export const AssortedBreadsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="14" rx="8" ry="5" />
    <ellipse cx="12" cy="11" rx="7" ry="4" />
    <ellipse cx="12" cy="8" rx="6" ry="3.5" />
  </svg>
);

// 13. Sandwich & Burger Icon - Gourmet layered burger
export const BurgerIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 10c0-3.9 3.1-7 7-7s7 3.1 7 7H5z" />
    <path d="M4 13h16" />
    <path d="M4 16h16" />
    <path d="M5 16c0 2.2 3.1 4 7 4s7-1.8 7-4H5z" />
    <circle cx="9" cy="6.5" r="0.75" fill="currentColor" />
    <circle cx="12" cy="5.5" r="0.75" fill="currentColor" />
    <circle cx="15" cy="6.5" r="0.75" fill="currentColor" />
  </svg>
);

// 14. Biriyani & Mandi Icon - Royal Dum Biriyani Pot
export const BiriyaniIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 10h14" />
    <path d="M4 10c0 5 3.6 9 8 9s8-4 8-9" />
    <path d="M7 6c1.5 1 2 2.5 2 4" />
    <path d="M12 4c1.5 1.5 1.5 3.5 1.5 6" />
    <path d="M17 6c-1.5 1-2 2.5-2 4" />
    <path d="M8 20h8" />
    <path d="M2 11h2" />
    <path d="M20 11h2" />
  </svg>
);

// 15. Rice Icon - Steaming rice bowl
export const RiceIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z" />
    <path d="M3 12h18" />
    <path d="M7 8c1-1 1-3 1-4" />
    <path d="M12 8c1-1 1-3 1-4" />
    <path d="M17 8c1-1 1-3 1-4" />
    <path d="M9 20h6" />
  </svg>
);

// 16. Add-on Icon - Plus circular seasoning bowl
export const AddonIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

// 17. Dessert Icon - Cake slice with berry
export const DessertIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 19H4a1 1 0 0 1-1-1v-4l9-6 9 6v4a1 1 0 0 1-1 1z" />
    <path d="M3 14h18" />
    <path d="M12 8v6" />
    <circle cx="12" cy="5" r="2" fill="currentColor" />
    <path d="M13 3c1-.5 2 0 2 0" />
  </svg>
);

// 18. Juice Icon - Tropical drink glass with straw & lemon slice
export const JuiceIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 6h12l-2 14H8L6 6z" />
    <path d="M5 6h14" />
    <path d="M7 11h10" />
    <path d="M14 2l-3 7" />
    <path d="M18 5a3 3 0 0 0-3-3" />
  </svg>
);

// 19. Milkshake Icon - Tall milkshake glass with whipped swirl & straw
export const MilkshakeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 8h8l-1.5 11h-5L8 8z" />
    <path d="M7.5 8c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5" />
    <path d="M12 4.5C12 3 13 2 14.5 2" />
    <path d="M14 2l-2 6" />
    <path d="M8 19h8" />
    <path d="M9 13h6" />
  </svg>
);

// 20. Frappe Icon - Iced coffee cup with dome lid
export const FrappeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9h12l-1.8 11H7.8L6 9z" />
    <path d="M5 9h14" />
    <path d="M7 9a5 5 0 0 1 10 0" />
    <path d="M13 2l-2 7" />
    <path d="M8 14h8" />
  </svg>
);

// 21. Beverage Icon - Chilled drink cup
export const BeverageIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 6h10l-1.5 14h-7L7 6z" />
    <path d="M6 6h12" />
    <path d="M10 2h4v4h-4z" />
    <path d="M8 12h8" />
  </svg>
);

// 22. Bucket Biriyani Icon - Party celebration biriyani feast bucket
export const BucketBiriyaniIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 9h14l-2 11H7L5 9z" />
    <path d="M4 9h16" />
    <path d="M5 9a7 7 0 0 1 14 0" />
    <path d="M8 14h8" />
    <path d="M9 17h6" />
    <circle cx="12" cy="5" r="1" fill="currentColor" />
  </svg>
);

// 23. Mobile Bottom Navigation Icons
export const HomeNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const MenuNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

export const SearchNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const CartNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
    <path d="M9 8h6" />
  </svg>
);

export const TableOrderNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 17h18" />
    <path d="M5 17a7 7 0 0 1 14 0" />
    <path d="M12 7V5" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
    <path d="M4 20h16" />
  </svg>
);

export const GoogleReviewNavIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export function getMenuCategoryIcon(iconName: string, className: string = 'w-4 h-4') {
  const key = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (key) {
    case 'all':
    case 'allmenu':
    case 'allitems':
      return <AllMenuIcon className={className} />;
    case 'soup':
      return <SoupIcon className={className} />;
    case 'freshharvest':
    case 'salad':
      return <FreshHarvestIcon className={className} />;
    case 'appetizers':
    case 'starters':
      return <AppetizersIcon className={className} />;
    case 'kingsspecialseafood':
    case 'seafood':
    case 'fish':
    case 'prawns':
      return <SeafoodIcon className={className} />;
    case 'asianmains':
    case 'asian':
      return <AsianMainsIcon className={className} />;
    case 'pastarisotto':
    case 'pasta':
      return <PastaIcon className={className} />;
    case 'mains':
      return <MainsIcon className={className} />;
    case 'indianmains':
    case 'indian':
      return <IndianMainsIcon className={className} />;
    case 'noodlerice':
    case 'noodles':
      return <NoodleRiceIcon className={className} />;
    case 'assortedbreads':
    case 'breads':
    case 'naan':
      return <AssortedBreadsIcon className={className} />;
    case 'sandwichburger':
    case 'burger':
    case 'sandwich':
      return <BurgerIcon className={className} />;
    case 'biriyanimandi':
    case 'biriyani':
      return <BiriyaniIcon className={className} />;
    case 'rice':
      return <RiceIcon className={className} />;
    case 'addon':
    case 'addons':
      return <AddonIcon className={className} />;
    case 'dessert':
    case 'desserts':
      return <DessertIcon className={className} />;
    case 'juice':
    case 'juices':
      return <JuiceIcon className={className} />;
    case 'milkshake':
    case 'milkshakes':
    case 'shakes':
      return <MilkshakeIcon className={className} />;
    case 'frappe':
    case 'frappes':
      return <FrappeIcon className={className} />;
    case 'beverage':
    case 'beverages':
      return <BeverageIcon className={className} />;
    case 'bucketbiriyani':
    case 'bucket':
      return <BucketBiriyaniIcon className={className} />;
    default:
      return <AllMenuIcon className={className} />;
  }
}
