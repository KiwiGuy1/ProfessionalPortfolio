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
            fontSize: "2.5rem",
            minWidth: "260px",
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
            right: "500px",
            textAlign: "left",
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
              color: "gray",
              fontWeight: 400,
              fontSize: "2.25rem",
              marginTop: "1rem",
            }}
          >
            An E-Commerce Analytics Dashboard
          </motion.div>
          <div className="relative pt-5 flex">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="rounded"
              style={{
                color: "#38405F",
                fontWeight: 400,
                fontSize: "1.75rem",
                marginTop: "1rem",
                textAlign: "left",
              }}
            >
              <strong>Role</strong>
              <br />
              full-stack developer
            </motion.div>
            {/* <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="p-4 rounded"
              style={{
                color: "#38405F",
                fontWeight: 400,
                fontSize: "1.75rem",
                marginTop: "1rem",
                textAlign: "left",
              }}
            >
              <strong>Strength</strong>
              <br />
              Add your own content here.
            </motion.div> */}
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
            top: "400px",
            right: "40px",
            width: "1.5rem",
            height: "1.5rem",
            filter: `drop-shadow(0 0 4px ${COLORS.accent})`,
          }}
        />
      </div>

      {/* Content above blur */}
      <ProjectsPhysics />
    </div>
  );
};

export default ProjectsPage;
