"use client"

import { motion } from "framer-motion"
import Image from "next/image"

type Client = {
  id: number
  name: string
  logo: string
}

type ClientLogoProps = {
  client: Client
  index: number
}

export default function ClientLogo({ client, index }: ClientLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative h-16 w-full grayscale transition-all duration-300 group-hover:grayscale-0">
        <Image
          src={client.logo || "/placeholder.svg"}
          alt={client.name}
          fill
          className="object-contain brightness-0 invert"
        />
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
    </motion.div>
  )
}

