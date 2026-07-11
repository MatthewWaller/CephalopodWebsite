import MemphisShape from "./memphis-shape"

export default function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Grid paper background */}
      <div className="absolute inset-0 grid-paper-background"></div>

      {/* Decorative Memphis shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-20">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="absolute bottom-20 right-10 w-40 h-40 opacity-20">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 opacity-20">
        <MemphisShape type="zigzag" color="bg-accent" />
      </div>
    </div>
  )
}

