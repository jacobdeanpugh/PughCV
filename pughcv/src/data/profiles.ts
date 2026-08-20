import { ResumeData } from "@/types/resume";

export const DEAN_MASTER_PROFILE: ResumeData = {
  fullName: "Dean Pugh",
  contact: {
    email: "deanpugh0720@gmail.com", 
    phone: "(949) 616 2058",
    location: "Riverside, CA",
    linkedin: null,
  },
  professionalSummary:
    "Accomplished Operations, Logistics, and Sales Manager with extensive leadership across warehouse operations, international and domestic shipping, inventory control, and enterprise account management.",
  skills: [
    "Warehouse Operations Management",
    "International & Domestic Shipping",
    "Inventory Control & Cycle Counting",
    "Supply Chain & Logistics",
    "B2B Sales & Account Management",
    "Freight Forwarding & LTL Shipping",
    "Vendor Negotiations (Overseas/Asia)",
    "EDI Transmissions (Invoices & ASN)",
    "Forklift Certified (High Reach)",
    "Sage 300 / MAS 90 / Quickbooks",
    "Edisoft Merchant & Linxorder",
    "Microsoft Excel & Access",
  ],
  experience: [
    {
      company: "Ultra Wheel Company",
      role: "Sales, New Business Development & Large Account Executive",
      location: "Fullerton, CA",
      period: "10/2007 - Present",
      bullets: [
        "Managed relationships and balance requirements for major regional and national automotive distributors while aggressively developing high-value accounts.",
        "Facilitated and reconciled large overseas container shipments, coordinating directly between brokers and international manufacturing facilities in China.",
        "Processed EDI transactions, invoices, and Advance Shipping Notices (ASNs) using specialized ERP and inventory management platforms.",
        "Collaborated with product design and marketing teams during trade shows and development meetings to expand product lines and new sales avenues.",
        "Provided advanced technical support and customer service regarding vehicle wheel fitments and warranty resolutions.",
      ],
    },
    {
      company: "Monet Wheels Inc.",
      role: "Sales & Warehouse Manager",
      location: "Huntington Beach, CA",
      period: "10/2003 - 10/2007",
      bullets: [
        "Recruited, hired, trained, and supervised all warehouse staff and sales associates.",
        "Directed the end-to-end relocation, setup, layout design, and inventory slotting of the corporate warehouse facility.",
        "Negotiated contracts with overseas suppliers in China and Taiwan while forecasting and scheduling inbound container logistics.",
        "Managed physical inventory counts, cycle count programs, and overall loss prevention.",
        "Drove outside sales campaigns, consistently meeting performance quotas, acquiring accounts, and managing credit collections.",
      ],
    },
    {
      company: "Status One Wheels",
      role: "Operations Manager",
      location: "Carson, CA",
      period: "05/2001 - 10/2003",
      bullets: [
        "Supervised all daily warehouse operations, inventory receiving, container unloading, order fulfillment, and reverse logistics/returns inspection.",
        "Negotiated freight rates, set up commercial carrier accounts, and coordinated complex freight and parcel shipments.",
        "Led and scheduled the sales team, conducting sales calls, territory routing, and representing the organization at national industry trade shows.",
      ],
    },
    {
      company: "Trailmaster",
      role: "Warehouse Lead",
      location: "Corona, CA",
      period: "06/2000 - 05/2001",
      bullets: [
        "Coordinated LTL freight schedules and parcel operations (UPS) while supervising inventory count teams.",
        "Provided frontline technical support and customer service for automotive parts fulfillment.",
      ],
    },
    {
      company: "Progressive Custom Wheels",
      role: "Warehouse Manager & Production Foreman",
      location: "Riverside, CA",
      period: "1986 - 2000",
      bullets: [
        "Managed 100,000 sq. ft. central distribution warehouse and led a team of 15 personnel supplying 60 regional branches nationwide.",
        "Designed optimal warehouse floor layouts, directed full physical inventory audits, and reconciled variance reports.",
        "Negotiated carrier shipping rates, scheduled long-haul truck routes, and coordinated customs documentation for international freight.",
        "Promoted from Production Foreman (1986–1989) and UPS Coordinator (1989–1990), maintaining strict safety protocols and meeting aggressive production targets.",
      ],
    },
  ],
  education: [
    {
      institution: "Henley High School",
      degree: "High School Diploma",
      year: "1983",
    },
  ],
};

export const MARC_MASTER_PROFILE: ResumeData = {
  fullName: "Marc A. Pugh",
  contact: {
    email: "guitarmenace23@gmail.com",
    phone: "714-396-5071",
    location: "Anaheim, CA",
    linkedin: null,
  },
  professionalSummary:
    "Senior Sales Executive and Custom Wheel Designer with over 35 years of industry excellence across B2B account management, custom wheel engineering, trade show execution, and warehouse distribution operations.",
  skills: [
    "B2B Sales & Account Development",
    "Custom Wheel Design & Fitment",
    "Technical Automotive Specifications",
    "SEMA & Industry Trade Show Execution",
    "Product Development Lifecycle",
    "Catalog & Data Book Production",
    "Brand Sponsorship Management",
    "EDI Order Processing",
    "Warehouse Supervision & Inventory",
    "Client Relationship Management",
  ],
  experience: [
    {
      company: "Ultra Wheel Company",
      role: "Sales Executive & Wheel Designer",
      location: "Fullerton, CA",
      period: "07/2004 - 07/2026",
      bullets: [
        "Managed key existing client relationships while identifying and closing new distributor and retail business accounts nationwide.",
        "Conceived and developed 16 original wheel designs from initial concept drawings through commercial manufacturing and market launch.",
        "Authored and designed comprehensive product catalogs, fitment guides, and technical data books for national distribution networks.",
        "Represented brand leadership annually at major automotive expos, including SEMA, and managed high-profile sponsorship programs.",
        "Delivered technical application consultations, ensuring accurate vehicle fitments, offset calculations, and load ratings.",
      ],
    },
    {
      company: "Mondera Wheels",
      role: "Sales Executive",
      location: "Riverside, CA",
      period: "03/2001 - 07/2004",
      bullets: [
        "Expanded regional market share through consultative sales calls, inbound phone sales, and account relationship management.",
        "Provided expert wheel fitment recommendations and aftermarket custom sizing guidance.",
      ],
    },
    {
      company: "Progressive Wheels",
      role: "Warehouse Manager & Sales Executive",
      location: "Riverside, CA",
      period: "08/1987 - 05/2000",
      bullets: [
        "Supervised warehouse floor personnel, managed receiving and dispatch operations, and conducted routine inventory variance analysis.",
        "Blended warehouse logistics oversight with active territory sales development and customer account retention.",
      ],
    },
  ],
  education: [
    {
      institution: "Henley High School",
      degree: "High School Diploma",
      year: "1983",
    },
  ],
};

export const PROFILES: Record<string, ResumeData> = {
  dean: DEAN_MASTER_PROFILE,
  marc: MARC_MASTER_PROFILE,
};