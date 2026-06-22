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

  const faqItems = [
    {
      category: "General",
      question: "What does MCS specialize in?",
      answer:
        "MCS specializes in hydrography, bathymetry, GIS, dredging support, environmental studies, coastal engineering, and project consultancy support.",
      sortOrder: 1,
      isActive: true,
    },
    {
      category: "General",
      question: "Where do you operate?",
      answer:
        "Our core operations are in Bangladesh across inland waterways, coastal zones, ports, and marine infrastructure project locations.",
      sortOrder: 2,
      isActive: true,
    },
    {
      category: "Projects & Services",
      question: "Can MCS support both survey and consultancy in one project?",
      answer:
        "Yes. We provide integrated support from field survey and data processing to analysis, modelling, reporting, and implementation guidance.",
      sortOrder: 1,
      isActive: true,
    },
    {
      category: "Projects & Services",
      question: "Do you support dredging projects?",
      answer:
        "Yes. We support pre- and post-dredging survey, monitoring, volume verification, and morphological analysis.",
      sortOrder: 2,
      isActive: true,
    },
    {
      category: "Training",
      question: "Who can join MCS training programs?",
      answer:
        "Government agencies, project teams, consultants, operators, and technical professionals can join based on program scope.",
      sortOrder: 1,
      isActive: true,
    },
    {
      category: "Training",
      question: "Can training be customized for our organization?",
      answer:
        "Yes. We can design role-based training modules aligned with your tools, project needs, and timeline.",
      sortOrder: 2,
      isActive: true,
    },
  ]

  for (const item of faqItems) {
    const existingItem = await prisma.faqItem.findFirst({
      where: { question: item.question },
    })

    if (existingItem) {
      await prisma.faqItem.update({
        where: { id: existingItem.id },
        data: item,
      })
    } else {
      await prisma.faqItem.create({ data: item })
    }
  }

  await prisma.deliveryApproachSection.upsert({
    where: { id: "main" },
    update: {
      eyebrow: "Our Delivery Approach",
      title: "Accurate. Actionable. Sustainable.",
      isActive: true,
    },
    create: {
      id: "main",
      eyebrow: "Our Delivery Approach",
      title: "Accurate. Actionable. Sustainable.",
      isActive: true,
    },
  })

  const deliveryApproachSteps = [
    {
      title: "Field Data Collection",
      description:
        "High-quality survey and monitoring data collection from riverine, coastal, and marine environments.",
      iconKey: "Search",
      sortOrder: 1,
      isActive: true,
    },
    {
      title: "Technical Analysis",
      description:
        "Integrated GIS, modelling, and environmental analysis to produce reliable technical insights.",
      iconKey: "PenTool",
      sortOrder: 2,
      isActive: true,
    },
    {
      title: "Practical Solutions",
      description:
        "Actionable recommendations aligned with project realities, timelines, and operational needs.",
      iconKey: "Activity",
      sortOrder: 3,
      isActive: true,
    },
    {
      title: "Sustainable Delivery",
      description:
        "Implementation support focused on long-term environmental and operational performance.",
      iconKey: "ShieldCheck",
      sortOrder: 4,
      isActive: true,
    },
  ]

  for (const step of deliveryApproachSteps) {
    const existingStep = await prisma.deliveryApproachStep.findFirst({
      where: { title: step.title },
    })

    if (existingStep) {
      await prisma.deliveryApproachStep.update({
        where: { id: existingStep.id },
        data: step,
      })
    } else {
      await prisma.deliveryApproachStep.create({ data: step })
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
