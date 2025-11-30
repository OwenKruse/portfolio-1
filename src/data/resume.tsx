import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Owen Kruse",
  initials: "OK",
  url: "https://github.com/OwenKruse",
  location: "Bellingham, WA",
  locationLink: "https://www.google.com/maps/place/Bellingham,+WA",
  description:
    "Computer Science student and software engineer building practical, user-focused projects.",
  summary:
    "CS student at Western Washington University (2022–Present). Recent Software Engineer Intern at Cita Marketplace. Built projects like Fiscus Financial and ZestTV, with experience across full‑stack web development, API integrations, and deploying to cloud platforms.",
  avatarUrl: "/me.JPG",
  skills: [
    "TypeScript",
    "Next.js",
    "React",
    "Rust",
    "Python",
    "Pine Script",
    "Java",
    "AWS",
    "SQL",
    "TRPC",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "https://www.linkedin.com/in/owen-kruse-844ba4263/", icon: Icons.linkedin, label: "LinkedIn" },
  ],
  contact: {
    email: "kruseo@wwu.edu",
    tel: "+1-206-259-1254",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/OwenKruse",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "#",
        icon: Icons.linkedin,

        navbar: false,
      },
      X: {
        name: "X",
        url: "#",
        icon: Icons.x,

        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "#",
        icon: Icons.youtube,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "mailto:kruseo@wwu.edu",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Cita Marketplace",
      href: "#",
      badges: [],
      title: "Software Engineer Internship",
      logoUrl: "/cita.png",
      start: "August 2024",
      end: "October 2024",
      description:
        "Built scalable full‑stack features using Next.js, TypeScript, TRPC, and SQL databases; deployed services to AWS and Vercel. Implemented responsive UI with Tailwind CSS and optimized API performance and database queries to improve load times. Worked in an Agile team across product and design to deliver prioritized user stories, incorporated client feedback, and participated in code reviews and the full software development lifecycle.",
    },
    {
      company: "Island Home Center & Lumber",
      href: "#",
      badges: [],
      title: "Floor Support and Inventory Coordinator",
      logoUrl: "/vashon-home-lumber.svg",
      start: "June 2024",
      end: "August 2024",
      description:
        "Improved inventory workflows and purchasing coordination through data-driven tracking and process refinements, reducing stock discrepancies and improving order accuracy. Collaborated with cross-functional teams and vendors to align inventory levels with demand and supported point-of-sale and customer interactions, strengthening communication and problem-solving skills.",
    },
 
  ],
  education: [
    {
      school: "Western Washington University",
      href: "https://www.wwu.edu",
      degree: "Bachelor's Degree in Computer Science",
      start: "2022",
      end: "Present",
      logoUrl: "/wwu.svg",
    },
    {
      school: "Vashon Island High School",
      href: "https://www.vashonsd.org",
      degree: "High School Diploma",
      start: "2018",
      end: "2022",
      logoUrl: "/vashon-hs.png",
    }
  ],
  projects: [
    {
      title: "Professionly.co",
      href: "https://www.professionly.co",
      dates: "2025",
      active: true,
      description:
        "Co-founded a platform connecting students with job opportunities; led technical development, product roadmap, and user‑driven feature iteration.",
      technologies: ["Next.js", "TypeScript"],
      links: [
        { type: "Website", href: "https://www.professionly.co", icon: <Icons.globe className="size-3" /> },
      ],
      image: "/Professionly.png",
      video: "",
    },
    {
      title: "Fiscus Trade",
      href: "https://trade.fiscusfinancial.pro",
      dates: "2025",
      active: true,
      description:
        "Realtime finacial research platform, market sentiment analsis, and stock trading. integrating the Alpaca API for secure stock trading and displaying user positions and transactions.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Alpaca", "PostgreSQL"],
      links: [
        { type: "Website", href: "https://trade.fiscusfinancial.pro", icon: <Icons.globe className="size-3" /> },
      ],
      image: "/trade/chart.png",
      video: "",
    },
    {
      title: "Fiscus Financial",
      href: "https://www.fiscusfinancial.pro",
      dates: "2025",
      active: true,
      description:
        "Building a platform of finacial tools for the average person to manage their money and investments.",
      underConstruction: true,
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Plaid", "PostgreSQL"],
      links: [
        { type: "Website", href: "https://www.fiscusfinancial.pro", icon: <Icons.globe className="size-3" /> },
      ],
      image: "/fiscus-financial.png",
      video: "",
    },
    {
      title: "Fiscus Wallet",
      href: "https://wallet.fiscusfinancial.pro",
      dates: "2025 - Present",
      active: true,
      description:
        "Full‑stack wallet application for Fiscus Financial, integrating Plaid API for secure financial data access and displaying user balances and transactions.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Plaid", "PostgreSQL"],
      links: [
        { type: "Website", href: "https://wallet.fiscusfinancial.pro", icon: <Icons.globe className="size-3" /> },
      ],
      image: "/Wallet.png",
      video: "",
    },
    {
      title: "Vashon Build",
      href: "https://www.vashonbuild.com",
      dates: "2023-2025",
      active: true,
      description: " Designed and developed a website for Vashon Build, a local homebuilder. Implemented responsive layouts, performance improvements, and search-friendly structure.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      links: [
        { type: "Website", href: "https://www.vashonbuild.com", icon: <Icons.globe className="size-3" /> },
      ],
      image: "/vashon-build/img.png",
      video: "",
    },
    // {
    //   title: "ZestTV",
    //   href: "https://www.zesttv.live",
    //   dates: "2025",
    //   active: true,
    //   description:
    //     "Scalable movie and TV streaming platform with live sports, trailers, and reviews. Emphasized performance, media playback reliability, and usability.",
    //   technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    //   links: [
    //     { type: "Website", href: "https://www.zesttv.live", icon: <Icons.globe className="size-3" /> },
    //   ],
    //   image: "/zesttv.png",
    //   video: "",
    // },
    {
      title: "Lume Tide Swim",
      href: "https://www.lumetideswim.com",
      dates: "2025",
      active: true,
      description: " Designed and developed a website for Lume Tide Swim, a local swim-wear brand. Implemented responsive layouts, performance improvements, and search-friendly structure.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      links: [
        { type: "Website", href: "https://www.lumetideswim.com", icon: <Icons.globe className="size-3" /> },
      ],
      image: "/lume-tide-swim.png",
      video: "",
    },
    {
      title: "CAAS",
      href: "https://www.caascmc.cc",
      dates: "2023",
      active: true,
      description:
        "Contributed to AI consulting projects delivering data-driven solutions and prototypes. Implemented web interfaces and backend components that enabled model integration and client demonstrations.",
      technologies: ["Next.js", "TypeScript"],
      links: [
        { type: "Website", href: "https://www.caascmc.cc", icon: <Icons.globe className="size-3" /> },
      ],
      image: "/caas.png",
      video: "",
    },
  ],
} as const;
