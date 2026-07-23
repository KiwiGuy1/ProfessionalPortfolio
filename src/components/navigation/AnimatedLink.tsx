import React, { useState, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimatedLinkProps extends HTMLMotionProps<"a"> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ANIMATION_DURATION = 0.5; // seconds

const AnimatedLink = forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ href, children, className, onClick, ...rest }, ref) => {
    const router = useRouter();
    const [isExiting, setIsExiting] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      e.preventDefault();
      setIsExiting(true);
      setTimeout(() => {
        router.push(href);
      }, ANIMATION_DURATION * 1000);
    };

    return (
      <motion.a
        ref={ref}
        href={href}
        className={className}
        onClick={handleClick}
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
        style={{ cursor: "pointer" }}
        {...rest}
      >
        {children}
      </motion.a>
    );
  }
);
AnimatedLink.displayName = "AnimatedLink";
export default AnimatedLink;
