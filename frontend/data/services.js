import {
  Ship,
  ShieldCheck,
  Route,
  BarChart3,
  Wrench,
  Leaf,
  Settings,
  BookOpen,
} from "lucide-react"

const services = [
  {
    id: 1,
    title: "Hydrographic & Bathymetric Surveys",
    description:
      "Accurate hydrographic and bathymetric surveys for waterways and coastal mapping.",
    icon: Ship,
  },
  {
    id: 2,
    title: "Dredging Monitoring & Morphological Studies",
    description:
      "Reliable dredging monitoring and morphological studies for efficient project performance.",
    icon: Wrench,
  },
  {
    id: 3,
    title: "GIS & Mapping Solutions",
    description:
      "Advanced GIS and mapping solutions for precise spatial data and analysis.",
    icon: BarChart3,
  },
  {
    id: 4,
    title: "Hydrodynamic & Numerical Modelling",
    description:
      "Hydrodynamic modelling services for simulating water flow and sediment movement.",
    icon: Leaf,
  },
  {
    id: 5,
    title: "Environmental & Oceanographic Studies",
    description:
      "Environmental and oceanographic studies supporting sustainable marine project development.",
    icon: Route,
  },
  {
    id: 6,
    title: "Coastal Engineering & Infrastructure Support",
    description:
      "Coastal engineering support ensuring stable, sustainable infrastructure and design solutions.",
    icon: ShieldCheck,
  },
  {
    id: 7,
    title: "Land Surveying & Drone Mapping",
    description:
      "High-precision land surveying and drone mapping for accurate data collection.",
    icon: Settings,
  },
  {
    id: 8,
    title: "Training & Capacity Development",
    description:
      "Professional training programs to develop skills in marine and geospatial fields.",
    icon: BookOpen,
  },
]

export { services }
