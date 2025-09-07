import { motion } from "framer-motion";
import { useBlobHover } from "./BlobHoverContext";
import { useRef } from "react";
import "./physics.css";

const navItems = [
  { text: "Home", link: "/" },
  { text: "Projects", link: "/projects" },
  { text: "About", link: "/about" },
  { text: "Contact", link: "/contact" },
];

// Add the onNavigate prop type
interface GlobalNavProps {
  onNavigate: (href: string) => void;
}

export default function GlobalNav({ onNavigate }: GlobalNavProps) {
  const { setHovered } = useBlobHover();
  const navRefs = useRef<HTMLAnchorElement[]>([]);

  return (
    <motion.div
      className="nav-bar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 1 }}
    >
      <span className="kiwi-text">KIWI</span>
      <nav className="nav">
        {navItems.map((item, i) => (
          <a
            key={item.text}
            href={item.link}
            ref={(el) => {
              if (el) navRefs.current[i] = el;
            }}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.link);
            }}
            onMouseEnter={() => {
              const rect = navRefs.current[i]?.getBoundingClientRect();
              if (rect) {
                setHovered(true, item.text, {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                });
              }
            }}
            onMouseLeave={() => setHovered(false)}
            className="nav-link"
          >
            {item.text}
          </a>
        ))}
      </nav>
    </motion.div>
  );
}
