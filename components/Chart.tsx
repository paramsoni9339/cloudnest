"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { convertFileSize } from "@/lib/utils";

interface ChartProps {
  used: number;
}

const Chart = ({ used = 0 }: ChartProps) => {
  const total = 2 * 1024 * 1024 * 1024; // 2GB in bytes
  const percentage = (used / total) * 100;
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={chartRef} className="relative h-[300px] w-full">
      {/* Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[200px] w-[200px] rounded-full bg-[#FF6B6B]/10" />
      </div>

      {/* Main Chart */}
      <div className="relative h-full w-full">
        {/* Circular Progress */}
        <svg className="h-full w-full" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="16"
            strokeOpacity="0.1"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 502.4 }}
            animate={{ 
              strokeDashoffset: isVisible ? 502.4 - (502.4 * percentage) / 100 : 502.4 
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            strokeDasharray="502.4"
            transform="rotate(-90 100 100)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#FF8E8E" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isVisible ? 1 : 0.8,
              opacity: isVisible ? 1 : 0
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <h3 className="h4 text-white">{convertFileSize(used)}</h3>
            <p className="body-2 text-white/70">of 2GB used</p>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute inset-0"
        >
          {/* Floating Icons */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[15%] top-[20%]"
          >
            <div className="glass-card rounded-full p-2 bg-[#FF6B6B]/20">
              <svg className="h-6 w-6 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute right-[15%] top-[30%]"
          >
            <div className="glass-card rounded-full p-2 bg-[#FF6B6B]/20">
              <svg className="h-6 w-6 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none">
                <path d="M4 16L8.586 11.414C8.961 11.039 9.469 10.828 10 10.828C10.531 10.828 11.039 11.039 11.414 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.469 11.828 17 11.828C17.531 11.828 18.039 12.039 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute left-[25%] bottom-[25%]"
          >
            <div className="glass-card rounded-full p-2 bg-[#FF6B6B]/20">
              <svg className="h-6 w-6 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none">
                <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14M5 18H16C17.1046 18 18 17.1046 18 16V8C18 6.89543 17.1046 6 16 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Usage Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 20
          }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="absolute bottom-0 left-0 right-0"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-2 w-2 rounded-full bg-[#FF6B6B]" />
            <p className="body-2 text-white/70">Used Storage</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chart;
