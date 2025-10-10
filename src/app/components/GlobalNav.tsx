"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import "./physics.css";

const navItems = [
  { text: "Home", link: "/", color: "#6C63FF" },
  { text: "Projects", link: "/projects", color: "#8B5FBF" },
  { text: "About", link: "/about", color: "#A855F7" },
  { text: "Contact", link: "/contact", color: "#C084FC" },
];

interface GlobalNavProps {
  onNavigate: (href: string) => void;
  currentPath?: string; // Add current path prop
}

export default function GlobalNav({
  onNavigate,
  currentPath = "/",
}: GlobalNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePath, setActivePath] = useState(currentPath);
  const atomRef = useRef<HTMLDivElement>(null);
  const electronRefs = useRef<HTMLDivElement[]>([]);
  const navItemRefs = useRef<HTMLDivElement[]>([]);
  const nucleusRef = useRef<HTMLDivElement>(null);
  const desktopAtomRefs = useRef<HTMLDivElement[]>([]);

  // Update active path when currentPath changes
  useEffect(() => {
    setActivePath(currentPath);
  }, [currentPath]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP animations for atoms (both mobile and desktop)
  useEffect(() => {
    // Mobile atom animations
    if (atomRef.current) {
      electronRefs.current.forEach((electron, index) => {
        if (electron) {
          gsap.set(electron, { rotation: index * 120 });
          gsap.to(electron, {
            rotation: `+=${360}`,
            duration: 3 + index * 0.5,
            ease: "none",
            repeat: -1,
          });
        }
      });

      if (nucleusRef.current) {
        gsap.to(nucleusRef.current, {
          scale: 1.2,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }

    // Desktop atom animations
    if (!isMobile) {
      desktopAtomRefs.current.forEach((atomContainer, atomIndex) => {
        if (atomContainer) {
          const electrons = atomContainer.querySelectorAll(".desktop-electron");
          electrons.forEach((electron, electronIndex) => {
            gsap.set(electron, { rotation: electronIndex * 180 });
            gsap.to(electron, {
              rotation: `+=${360}`,
              duration: 2 + electronIndex * 0.3,
              ease: "none",
              repeat: -1,
            });
          });

          const nucleus = atomContainer.querySelector(".desktop-nucleus");
          if (nucleus) {
            gsap.to(nucleus, {
              scale: 1.15,
              duration: 1.5,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
              delay: atomIndex * 0.2,
            });
          }
        }
      });
    }
  }, [isMobile]);

  const toggleNav = () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      if (atomRef.current) {
        gsap.to(atomRef.current, {
          scale: 1.5,
          rotation: 180,
          duration: 0.3,
          ease: "power1.inOut",
        });
      }

      electronRefs.current.forEach((electron, index) => {
        if (electron) {
          gsap.to(electron, {
            scale: 0,
            duration: 0.2,
            delay: index * 0.05,
          });
        }
      });

      if (nucleusRef.current) {
        gsap.to(nucleusRef.current, {
          scale: 0.3,
          duration: 0.3,
        });
      }
    } else {
      if (atomRef.current) {
        gsap.to(atomRef.current, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power1.inOut",
        });
      }

      electronRefs.current.forEach((electron, index) => {
        if (electron) {
          gsap.to(electron, {
            scale: 1,
            duration: 0.3,
            delay: index * 0.05,
          });
        }
      });

      if (nucleusRef.current) {
        gsap.to(nucleusRef.current, {
          scale: 1,
          duration: 0.3,
        });
      }
    }
  };

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setActivePath(href); // Update active path immediately
    onNavigate(href);
    setIsOpen(false);

    if (atomRef.current) {
      gsap.to(atomRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "power1.inOut",
      });
    }
  };

  // Helper function to check if item is active
  const isActive = (itemPath: string) => {
    return activePath === itemPath;
  };

  return (
    <>
      <motion.div
        className="nav-bar fixed top-0 left-0 w-full z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(15, 15, 15, 0.95) 0%, 
              rgba(23, 23, 28, 0.95) 100%
            )
          `,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(108, 99, 255, 0.2)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* KIWI Logo */}
          <motion.div
            className="text-2xl font-bold cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 8px rgba(108, 99, 255, 0.3))",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => handleNavClick("/")}
          >
            KIWI
          </motion.div>

          {/* Desktop Atomic Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-6">
              {navItems.map((item, index) => {
                const active = isActive(item.link);

                return (
                  <motion.button
                    key={item.text}
                    onClick={() => handleNavClick(item.link)}
                    className="relative group"
                    style={{
                      background: active ? `${item.color}15` : "none",
                      border: active
                        ? `1px solid ${item.color}40`
                        : "1px solid transparent",
                      cursor: "pointer",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Desktop Mini Atom */}
                    <div
                      ref={(el) => {
                        if (el) desktopAtomRefs.current[index] = el;
                      }}
                      className="relative"
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Mini Nucleus */}
                      <div
                        className="desktop-nucleus"
                        style={{
                          width: active ? "6px" : "4px",
                          height: active ? "6px" : "4px",
                          background: `
                            radial-gradient(circle, 
                              ${item.color} 0%, 
                              ${item.color}CC 100%
                            )
                          `,
                          borderRadius: "50%",
                          boxShadow: active
                            ? `0 0 12px ${item.color}, 0 0 20px ${item.color}40`
                            : `0 0 6px ${item.color}`,
                          zIndex: 3,
                          transition: "all 0.3s ease",
                        }}
                      />

                      {/* Mini Electron Orbits */}
                      {[0, 1].map((electronIndex) => (
                        <div
                          key={electronIndex}
                          className="desktop-electron"
                          style={{
                            position: "absolute",
                            width: active ? "20px" : "16px",
                            height: active ? "20px" : "16px",
                            border: active
                              ? `2px solid ${item.color}80`
                              : `1px solid ${item.color}40`,
                            borderRadius: "50%",
                            transform: `rotate(${electronIndex * 90}deg)`,
                            transformOrigin: "center",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {/* Mini Electron Dot */}
                          <div
                            style={{
                              position: "absolute",
                              top: active ? "-2px" : "-1px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: active ? "3px" : "2px",
                              height: active ? "3px" : "2px",
                              background: item.color,
                              borderRadius: "50%",
                              boxShadow: active
                                ? `0 0 8px ${item.color}`
                                : `0 0 4px ${item.color}`,
                              transition: "all 0.3s ease",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Navigation Text */}
                    <motion.span
                      className="text-base font-medium relative"
                      style={{
                        background: `linear-gradient(135deg, ${item.color} 0%, #FFFFFF 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: active ? "transparent" : "#FFFFFF",
                        backgroundClip: "text",
                        transition: "all 0.3s ease",
                        textShadow: active ? `0 0 8px ${item.color}40` : "none",
                      }}
                      whileHover={{
                        scale: 1.05,
                      }}
                    >
                      {item.text}
                    </motion.span>

                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                        style={{
                          width: "6px",
                          height: "6px",
                          background: item.color,
                          borderRadius: "50%",
                          boxShadow: `0 0 8px ${item.color}`,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3, ease: "backOut" }}
                      />
                    )}

                    {/* Orbital Ring on Hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        border: `1px solid ${item.color}30`,
                        borderRadius: "12px",
                        opacity: 0,
                      }}
                      whileHover={{
                        opacity: 1,
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Energy Glow on Hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `
                          radial-gradient(circle, 
                            ${item.color}15 0%, 
                            transparent 70%
                          )
                        `,
                        borderRadius: "12px",
                        opacity: active ? 0.5 : 0,
                      }}
                      whileHover={{
                        opacity: 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                );
              })}
            </nav>
          )}

          {/* Mobile Atom Menu Button */}
          {isMobile && (
            <motion.button
              onClick={toggleNav}
              className="relative w-12 h-12 flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
              style={{
                background: `
                  radial-gradient(circle, 
                    rgba(108, 99, 255, 0.1) 0%, 
                    rgba(168, 85, 247, 0.05) 100%
                  )
                `,
                borderRadius: "50%",
                border: "1px solid rgba(108, 99, 255, 0.3)",
              }}
            >
              <div
                ref={atomRef}
                className="relative w-8 h-8"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Nucleus */}
                <div
                  ref={nucleusRef}
                  style={{
                    width: "6px",
                    height: "6px",
                    background: `
                      radial-gradient(circle, 
                        rgba(108, 99, 255, 1) 0%, 
                        rgba(168, 85, 247, 0.8) 100%
                      )
                    `,
                    borderRadius: "50%",
                    boxShadow: "0 0 8px rgba(108, 99, 255, 0.6)",
                    zIndex: 3,
                  }}
                />

                {/* Electron Orbits */}
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      if (el) electronRefs.current[index] = el;
                    }}
                    style={{
                      position: "absolute",
                      width: "16px",
                      height: "16px",
                      border: "1px solid rgba(108, 99, 255, 0.2)",
                      borderRadius: "50%",
                      transform: `rotate(${index * 60}deg)`,
                      transformOrigin: "center",
                    }}
                  >
                    {/* Electron */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-1.5px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "3px",
                        height: "3px",
                        background: navItems[index]?.color || "#6C63FF",
                        borderRadius: "50%",
                        boxShadow: `0 0 6px ${
                          navItems[index]?.color || "#6C63FF"
                        }`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{
              background: `
                radial-gradient(circle at 50% 20%, 
                  rgba(108, 99, 255, 0.15) 0%, 
                  rgba(15, 15, 15, 0.95) 50%,
                  rgba(15, 15, 15, 0.98) 100%
                )
              `,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            onClick={() => setIsOpen(false)}
          >
            {/* Orbital Navigation Items */}
            <div className="absolute inset-0 flex items-center justify-center">
              {navItems.map((item, index) => {
                const angle = index * 90 - 45;
                const radius = 120;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const active = isActive(item.link);

                return (
                  <motion.div
                    key={item.text}
                    ref={(el) => {
                      if (el) navItemRefs.current[index] = el;
                    }}
                    initial={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      x,
                      y,
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="absolute"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavClick(item.link);
                    }}
                  >
                    <motion.div
                      className="relative cursor-pointer"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: active ? "90px" : "80px",
                        height: active ? "90px" : "80px",
                        background: `
                          radial-gradient(circle, 
                            ${item.color}${active ? "30" : "20"} 0%, 
                            ${item.color}${active ? "20" : "10"} 70%,
                            transparent 100%
                          )
                        `,
                        borderRadius: "50%",
                        border: `${active ? "3px" : "2px"} solid ${item.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: active
                          ? `
                              0 0 30px ${item.color}60,
                              0 0 60px ${item.color}30,
                              inset 0 1px 0 rgba(255, 255, 255, 0.1)
                            `
                          : `
                              0 0 20px ${item.color}40,
                              inset 0 1px 0 rgba(255, 255, 255, 0.1)
                            `,
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span
                        className="font-medium text-sm"
                        style={{
                          color: "#FFFFFF",
                          textShadow: active
                            ? `0 0 12px ${item.color}, 0 0 20px ${item.color}40`
                            : `0 0 8px ${item.color}`,
                          fontSize: active ? "15px" : "14px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {item.text}
                      </span>

                      {/* Orbital ring */}
                      <motion.div
                        style={{
                          position: "absolute",
                          width: active ? "100px" : "90px",
                          height: active ? "100px" : "90px",
                          border: `1px solid ${item.color}${
                            active ? "50" : "30"
                          }`,
                          borderRadius: "50%",
                          pointerEvents: "none",
                          transition: "all 0.3s ease",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: active ? 6 : 8,
                          ease: "linear",
                          repeat: Infinity,
                        }}
                      />

                      {/* Active center dot */}
                      {active && (
                        <motion.div
                          style={{
                            position: "absolute",
                            width: "4px",
                            height: "4px",
                            background: item.color,
                            borderRadius: "50%",
                            boxShadow: `0 0 8px ${item.color}`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Central close button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "60px",
                height: "60px",
                background: `
                  radial-gradient(circle, 
                    rgba(108, 99, 255, 0.2) 0%, 
                    rgba(168, 85, 247, 0.1) 100%
                  )
                `,
                borderRadius: "50%",
                border: "2px solid rgba(108, 99, 255, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 30px rgba(108, 99, 255, 0.3)",
              }}
            >
              <motion.div
                style={{
                  width: "20px",
                  height: "2px",
                  background: "#FFFFFF",
                  borderRadius: "1px",
                  position: "relative",
                }}
                animate={{ rotate: 45 }}
              />
              <motion.div
                style={{
                  width: "20px",
                  height: "2px",
                  background: "#FFFFFF",
                  borderRadius: "1px",
                  position: "absolute",
                }}
                animate={{ rotate: -45 }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
