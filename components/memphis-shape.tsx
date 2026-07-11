"use client"

import { motion } from "framer-motion"

type ShapeProps = {
  type: "circle" | "triangle" | "zigzag" | "squiggle"
  color: string
}

export default function MemphisShape({ type, color }: ShapeProps) {
  const getShape = () => {
    switch (type) {
      case "circle":
        return (
          <motion.div
            className={`w-full h-full rounded-full ${color}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        )
      case "triangle":
        return (
          <motion.div
            className="w-full h-full"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <div
              className={`w-0 h-0 border-l-[50px] border-r-[50px] border-b-[100px] border-l-transparent border-r-transparent ${
                color === "bg-primary"
                  ? "border-b-primary"
                  : color === "bg-secondary"
                    ? "border-b-secondary"
                    : color === "bg-accent"
                      ? "border-b-accent"
                      : "border-b-black"
              }`}
              style={{ margin: "0 auto" }}
            />
          </motion.div>
        )
      case "zigzag":
        return (
          <motion.div
            className={`w-full h-full ${color}`}
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 75% 50%, 100% 100%, 0% 100%, 25% 50%)" }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        )
      case "squiggle":
        return (
          <motion.div
            className="w-full h-full relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M10,50 Q30,30 50,50 T90,50"
                fill="none"
                stroke={
                  color === "bg-primary"
                    ? "hsl(322, 100%, 60%)"
                    : color === "bg-secondary"
                      ? "hsl(187, 100%, 42%)"
                      : color === "bg-accent"
                        ? "hsl(47, 100%, 50%)"
                        : "hsl(0, 0%, 98%)"
                }
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )
      default:
        return <div className={`w-full h-full rounded-full ${color}`} />
    }
  }

  return <div className="w-full h-full overflow-hidden">{getShape()}</div>
}

