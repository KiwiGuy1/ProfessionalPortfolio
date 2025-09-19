import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import "./physics.css";

const navItems = [
  { text: "Home", link: "/" },
  { text: "Projects", link: "/projects" },
  { text: "About", link: "/about" },
  { text: "Contact", link: "/contact" },
];

interface GlobalNavProps {
  onNavigate: (href: string) => void;
}

export default function GlobalNav({ onNavigate }: GlobalNavProps) {
  const navRefs = useRef<HTMLAnchorElement[]>([]);

  return (
    <motion.div
      className="nav-bar fixed top-0 left-0 w-full z-50 bg-white shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 1 }}
      style={{
        zIndex: 50,
        touchAction: "none",
        position: "fixed",
        width: "100%",
      }}
    >
      <span className="kiwi-text">KIWI</span>
      <nav className="nav">
        {navItems.map((item, i) => (
          <Link
            key={item.text}
            href={item.link}
            ref={(el) => {
              if (el) navRefs.current[i] = el;
            }}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.link);
            }}
            className="nav-link"
          >
            {item.text}
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}
