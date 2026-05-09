import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@mcs.com"
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!"
  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      name: "MCS Admin",
      email,
      passwordHash,
    },
  })

  const heroSlides = [
    {
      badgeText: "Leading The Horizon",
      title: "Marine & Geospatial Solutions for Bangladesh's Waterways",
      subtitle:
        "Delivering accurate data, practical insights, and sustainable solutions for ports, rivers, and coastal development. Empowering growth, safety, and environmental stewardship.",
      imageUrl: "/hero1.png",
      primaryButtonText: "Explore Our Solutions",
      primaryButtonLink: "/services",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/about-us",
      sortOrder: 1,
      isActive: true,
    },
    {
      badgeText: "Innovative Marine Solutions",
      title: "Transforming Bangladesh's Waterways with Innovation and Expertise",
      subtitle:
        "Empowering sustainable development and efficient management of ports, rivers, and coastal areas. Harnessing advanced technology and local expertise to drive growth, safety, and environmental stewardship.",
      imageUrl: "/hero2.png",
      primaryButtonText: "Discover Our Services",
      primaryButtonLink: "/services",
      secondaryButtonText: "Contact Us",
      secondaryButtonLink: "/contact",
      sortOrder: 2,
      isActive: true,
    },
  ]

  for (const slide of heroSlides) {
    const existingSlide = await prisma.heroSlide.findFirst({
      where: { title: slide.title },
    })

    if (existingSlide) {
      await prisma.heroSlide.update({
        where: { id: existingSlide.id },
        data: slide,
      })
    } else {
      await prisma.heroSlide.create({ data: slide })
    }
  }

  console.log(`Admin user ready: ${email}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
