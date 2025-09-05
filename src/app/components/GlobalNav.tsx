import { motion } from "framer-motion";
import { useBlobHover } from "./BlobHoverContext";
import { useRef } from "react";
import Link from "next/link";
import "./physics.css";

const navItems = [
  { text: "Home", link: "/" },
  { text: "Projects", link: "/projects" },
  { text: "About", link: "/about" },
  { text: "Contact", link: "/contact" },
];

export default function GlobalNav() {
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
          <Link
            key={item.text}
            href={item.link}
            ref={(el) => {
              if (el) navRefs.current[i] = el;
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
          >
            {item.text}
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}
