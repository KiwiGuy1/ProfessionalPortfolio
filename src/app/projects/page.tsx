"use client";
import React from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import ProjectsPhysics from "../components/projectsPhysics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const COLORS = {
  background: "#FFF",
  letter: "#141414",
  line: "#FFF",
  accent: "#6C63FF",
  topBarBG: "#EAE8FF",
};

const isMobile =
  typeof window !== "undefined" ? window.innerWidth < 600 : false;

const ProjectsPage: React.FC = () => {
  return (
    <div
      className={`relative w-full min-h-screen flex flex-col items-center overflow-x-hidden ${inter.className}`}
      style={{ background: COLORS.background }}
    >
      {/* Top Section */}
      <div
        className="w-full bg-white rounded-lg shadow-lg py-8 px-4 relative"
        style={{
          background: COLORS.topBarBG,
          minHeight: isMobile ? "320px" : "500px",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
      >
        {/* Portfolio Title */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="absolute"
          style={{
            top: isMobile ? "16px" : "40px",
            left: isMobile ? "12px" : "40px",
            color: COLORS.letter,
            fontWeight: 400,
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            minWidth: isMobile ? "120px" : "260px",
          }}
        >
          Portfolio
        </motion.div>

        {/* ShopSight Title & Description */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute"
          style={{
            top: isMobile ? "60px" : "200px",
            left: isMobile ? "12px" : undefined,
            right: isMobile ? undefined : "500px",
            textAlign: "left",
            width: isMobile ? "90vw" : undefined,
          }}
        >
          <div
            style={{
              color: COLORS.letter,
              fontWeight: 400,
              fontSize: isMobile ? "2.2rem" : "6.25rem",
              wordBreak: "break-word",
            }}
          >
            ShopSight
          </div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            style={{
              color: "gray",
              fontWeight: 400,
              fontSize: isMobile ? "1rem" : "2.25rem",
              marginTop: "0.5rem",
            }}
          >
            An E-Commerce Analytics Dashboard
          </motion.div>
          <div className="relative pt-3 flex flex-col gap-2">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="rounded"
              style={{
                color: "#38405F",
                fontWeight: 400,
                fontSize: isMobile ? "1rem" : "1.75rem",
                marginTop: "0.5rem",
                textAlign: "left",
              }}
            >
              <strong>Role</strong>
              <br />
              full-stack developer
            </motion.div>
          </div>
        </motion.div>

        {/* Arrow Icon */}
        <motion.img
          src="https://static.tildacdn.com/tild3334-3830-4632-b134-653465383365/arrow.svg"
          alt="Arrow"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.8 }}
          className="absolute"
          style={{
            top: isMobile ? "180px" : "400px",
            right: isMobile ? "16px" : "40px",
            width: isMobile ? "1rem" : "1.5rem",
            height: isMobile ? "1rem" : "1.5rem",
            filter: `drop-shadow(0 0 4px ${COLORS.accent})`,
          }}
        />
      </div>

      {/* Content below */}
      <div>
        <ProjectsPhysics />
      </div>
    </div>
  );
};

export default ProjectsPage;
