"use client";
import React from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";

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

const ProjectsPage: React.FC = () => {
  return (
    <div
      className={`relative w-full min-h-screen flex flex-col items-center overflow-hidden ${inter.className}`}
      style={{ background: COLORS.background }}
    >
      {/* Top Section: Portfolio title left, content right (absolute for fine tuning) */}
      <div
        className="w-full  bg-white rounded-lg shadow-lg py-12 px-8 relative min-h-[500px]"
        style={{ background: COLORS.topBarBG }}
      >
        {/* Portfolio Title */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="absolute"
          style={{
            top: "40px",
            left: "40px",
            color: COLORS.letter,
            fontWeight: 400,
            fontSize: "3.5rem",
            minWidth: "220px",
          }}
        >
          Portfolio
        </motion.div>

        {/* E-Commerce Analytic Dashboard */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute"
          style={{
            top: "200px",
            right: "800px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: COLORS.letter,
              fontWeight: 400,
              fontSize: "6.25rem",
            }}
          >
            ShopSight
          </div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            style={{
              color: "#38405F",
              fontWeight: 400,
              fontSize: "1.25rem",
              marginTop: "1rem",
            }}
          >
            An E-Commerce Analytics Dashboard
          </motion.div>
        </motion.div>
        {/* Info Box 1 */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute p-4 rounded"
          style={{
            top: "140px",
            right: "40px",
            background: COLORS.line,
            color: COLORS.letter,
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: `0 2px 16px ${COLORS.accent}22`,
            minWidth: "180px",
            textAlign: "right",
          }}
        >
          <strong>Info Box 1</strong>
          <br />
          Add your own content here.
        </motion.div>

        {/* Info Box 2 */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute p-4 rounded"
          style={{
            top: "220px",
            right: "40px",
            background: COLORS.line,
            color: COLORS.letter,
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: `0 2px 16px ${COLORS.accent}22`,
            minWidth: "180px",
            textAlign: "right",
          }}
        >
          <strong>Info Box 2</strong>
          <br />
          Add your own content here.
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="absolute"
          style={{
            top: "320px",
            right: "40px",
            color: COLORS.letter,
            fontSize: "1rem",
            textAlign: "right",
          }}
        >
          Add a description or summary here.
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
            top: "400px",
            right: "40px",
            width: "1.5rem",
            height: "1.5rem",
            filter: `drop-shadow(0 0 4px ${COLORS.accent})`,
          }}
        />
      </div>

      {/* Video Embed Placeholder */}
      <motion.div
        initial={{ y: 40, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="mx-auto mt-16 w-[690px] h-[374px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center"
        style={{
          background: COLORS.line,
          boxShadow: `0 4px 32px ${COLORS.accent}22`,
        }}
      >
        {/* Replace with your own video or image */}
        <span style={{ color: COLORS.letter, fontSize: "1.25rem" }}>
          Your media or embed here
        </span>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
