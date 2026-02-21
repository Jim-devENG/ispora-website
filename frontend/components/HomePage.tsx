import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { safeAnimate, safeTransition } from './utils/animationUtils';
import { Section } from './layout/Section';
import { PageHeader } from './layout/PageHeader';
import { Stat } from './layout/Stat';
import { CTAGroup } from './layout/CTAGroup';
import { SpiralCard } from './layout/SpiralCard';
import { FloatingShapes, AnimatedBlob, FloatingIcon } from './animations/FloatingElements';
import { AnimatedDots, AnimatedGrid } from './animations/AnimatedBackground';
import { FloatingImage } from './animations/ParallaxImage';
import { 
  Users, 
  Globe, 
  Building, 
  ArrowRight,
  Heart,
  Target,
  Network,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Briefcase,
  MapPin
} from 'lucide-react';

interface HomePageProps {
  onPageChange: (page: string, scrollTarget?: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section 
        className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-primary/20"
        style={{
          background: 'linear-gradient(135deg, hsl(213 100% 94%) 0%, hsl(221 100% 90%) 35%, hsl(235 85% 92%) 70%, hsl(210 100% 96%) 100%)'
        }}
      >
        {/* Animated Background Elements */}
        <AnimatedDots />
        <AnimatedGrid />
        <AnimatedBlob className="top-0 right-0 bg-primary/20" delay={0} size="w-96 h-96" />
        <AnimatedBlob className="bottom-0 left-0 bg-secondary/20" delay={2} size="w-80 h-80" />
          <FloatingShapes />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: safeTransition({ staggerChildren: 0.1, delayChildren: 0.2 })
              }
            }}
          >
            <motion.div variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: safeTransition({ duration: 0.6 }) }
            }}>
              <motion.div 
                whileHover={safeAnimate({ scale: 1.05 })}
                transition={safeTransition({ type: "spring", stiffness: 400 })}
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <motion.div
                    animate={safeAnimate({ rotate: [0, 360] })}
                    transition={safeTransition({ duration: 3, repeat: 999999, ease: "linear" })}
              >
                    <Sparkles className="h-3 w-3 mr-2" />
                  </motion.div>
                  Global Impact Engine
                </Badge>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: safeTransition({ delay: 0.1, duration: 0.6 }) }
              }}
            >
              iSpora is the Global Impact Engine
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: safeTransition({ delay: 0.2, duration: 0.6 }) }
              }}
            >
              For the Global South — and for the people and organizations everywhere committed to building its future.
            </motion.p>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: safeTransition({ delay: 0.3, duration: 0.6 }) }
              }}
            >
              <CTAGroup
                ctas={[
                  {
                    label: 'Discover our Story',
                    onClick: () => onPageChange('about'),
                    variant: 'outline'
                  },
                  {
                    label: 'Join our Community',
                    onClick: () => onPageChange('join'),
                    variant: 'primary'
                  }
                ]}
                layout="row"
                align="left"
              />
            </motion.div>
            </motion.div>
            
          {/* Right: Hero Image */}
          <motion.div
            className="relative"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: safeTransition({ duration: 0.8, delay: 0.3 })
              }
            }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center">
              {/* Globe image centered */}
              <FloatingImage
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=90"
                alt="Globe showing Global South regions: Africa, Caribbean, Latin America, Asia, Middle East, and Oceania"
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-contain opacity-90"
                delay={0.2}
              />
              
              {/* Modern network overlay with curved connections */}
              <div className="absolute inset-0 pointer-events-none">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1200 600"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <defs>
                    {/* Gradient for connection lines */}
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                    </linearGradient>
                    {/* Glow effect */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Organic curved connection paths between regions */}
                  <g stroke="url(#connectionGradient)" strokeWidth="2.5" fill="none" opacity="0.75">
                    {/* Africa to Latin America */}
                    <path d="M 600 450 Q 450 500 300 450" strokeDasharray="8 4" />
                    {/* Latin America to Caribbean */}
                    <path d="M 300 450 Q 280 380 320 320" strokeDasharray="8 4" />
                    {/* Caribbean to Middle East */}
                    <path d="M 320 320 Q 500 250 600 200" strokeDasharray="8 4" />
                    {/* Middle East to Asia */}
                    <path d="M 600 200 Q 750 250 900 300" strokeDasharray="8 4" />
                    {/* Asia to Oceania */}
                    <path d="M 900 300 Q 950 400 1000 450" strokeDasharray="8 4" />
                    {/* Oceania to Africa */}
                    <path d="M 1000 450 Q 800 500 600 450" strokeDasharray="8 4" />
                    {/* Africa to Asia */}
                    <path d="M 600 450 Q 700 350 900 300" strokeDasharray="8 4" />
                  </g>

                  {/* Region nodes with glow */}
                  <g filter="url(#glow)">
                    <circle cx="300" cy="450" r="8" fill="#3b82f6" opacity="0.8" />
                    <circle cx="320" cy="320" r="7" fill="#8b5cf6" opacity="0.8" />
                    <circle cx="600" cy="200" r="7" fill="#06b6d4" opacity="0.8" />
                    <circle cx="900" cy="300" r="8" fill="#10b981" opacity="0.8" />
                    <circle cx="1000" cy="450" r="7" fill="#f59e0b" opacity="0.8" />
                    <circle cx="600" cy="450" r="8" fill="#ef4444" opacity="0.8" />
                  </g>
                </svg>

                {/* Map-style location pins and callouts */}
                <div className="relative w-full h-full">
                  {/* iSpora - prominent center marker */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={safeTransition({ delay: 0.5, type: "spring", stiffness: 200 })}
                  >
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold shadow-xl whitespace-nowrap">
                        iSpora
                      </div>
                      <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg mx-auto"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/20 rounded-full -z-10 animate-ping"></div>
                    </div>
                  </motion.div>

                  {/* Africa - bottom center - Map pin style */}
                  <motion.div
                    className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={safeTransition({ delay: 0.6 })}
                  >
                    <div className="relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 shadow-md border border-slate-200 whitespace-nowrap">
                        Africa
                      </div>
                      <MapPin className="w-6 h-6 text-red-500 fill-red-500 drop-shadow-lg" />
                    </div>
                  </motion.div>

                  {/* Latin America - left center - Map pin style */}
                  <motion.div
                    className="absolute top-1/2 left-[15%] -translate-y-1/2 z-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={safeTransition({ delay: 0.7 })}
                  >
                    <div className="relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 shadow-md border border-slate-200 whitespace-nowrap">
                        Latin America
                      </div>
                      <MapPin className="w-6 h-6 text-blue-500 fill-blue-500 drop-shadow-lg" />
                    </div>
                  </motion.div>

                  {/* Caribbean - left upper - Map pin style */}
                  <motion.div
                    className="absolute top-[35%] left-[18%] z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={safeTransition({ delay: 0.8 })}
                  >
                    <div className="relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 shadow-md border border-slate-200 whitespace-nowrap">
                        Caribbean
                      </div>
                      <MapPin className="w-6 h-6 text-amber-500 fill-amber-500 drop-shadow-lg" />
                    </div>
                  </motion.div>

                  {/* Middle East - center upper - Map pin style */}
                  <motion.div
                    className="absolute top-[30%] left-1/2 -translate-x-1/2 z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={safeTransition({ delay: 0.9 })}
                  >
                    <div className="relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 shadow-md border border-slate-200 whitespace-nowrap">
                        Middle East
                      </div>
                      <MapPin className="w-6 h-6 text-cyan-500 fill-cyan-500 drop-shadow-lg" />
                    </div>
                  </motion.div>

                  {/* Asia - right center - Map pin style */}
                  <motion.div
                    className="absolute top-1/2 right-[20%] -translate-y-1/2 z-10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={safeTransition({ delay: 1.0 })}
                  >
                    <div className="relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 shadow-md border border-slate-200 whitespace-nowrap">
                        Asia
                      </div>
                      <MapPin className="w-6 h-6 text-green-500 fill-green-500 drop-shadow-lg" />
                    </div>
                  </motion.div>

                  {/* Oceania - right lower - Map pin style */}
                  <motion.div
                    className="absolute bottom-[20%] right-[22%] z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={safeTransition({ delay: 1.1 })}
                  >
                    <div className="relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 shadow-md border border-slate-200 whitespace-nowrap">
                        Oceania
                      </div>
                      <MapPin className="w-6 h-6 text-orange-500 fill-orange-500 drop-shadow-lg" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Faded gradient at bottom to blend into background */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
            </div>
            
            {/* Stats below image */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div 
                className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={safeTransition({ delay: 0.5 })}
              >
                <div className="text-xl sm:text-2xl font-bold text-primary mb-1">Growing</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Community</div>
              </motion.div>
                <motion.div
                className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={safeTransition({ delay: 0.6 })}
              >
                <div className="text-xl sm:text-2xl font-bold text-primary mb-1">Active</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Network</div>
              </motion.div>
                  <motion.div
                className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={safeTransition({ delay: 0.7 })}
                  >
                <div className="text-xl sm:text-2xl font-bold text-primary mb-1">Impact</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Driven</div>
                </motion.div>
                <motion.div
                className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={safeTransition({ delay: 0.8 })}
              >
                <div className="text-xl sm:text-2xl font-bold text-primary mb-1">Global</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Reach</div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
                <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"
              animate={safeAnimate({
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              })}
              transition={safeTransition({
                duration: 4,
                repeat: 999999,
                ease: "easeInOut"
              })}
            />
                  <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"
              animate={safeAnimate({
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              })}
              transition={safeTransition({
                duration: 5,
                repeat: 999999,
                ease: "easeInOut",
                delay: 1
              })}
            />
          </motion.div>
        </div>
      </Section>
        
      {/* The iSpora Spiral */}
      <Section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(270 40% 96%) 0%, hsl(200 50% 94%) 30%, hsl(180 35% 93%) 60%, hsl(200 50% 94%) 100%)'
        }}
      >
        {/* Purple and teal gradient overlays - more visible */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, hsl(270 60% 70% / 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, hsl(180 50% 60% / 0.25) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, hsl(200 60% 65% / 0.2) 0%, transparent 60%)
            `,
            backgroundSize: '100% 100%'
          }}
        />
        
        {/* Pattern - more visible */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(270 50% 60% / 0.12) 1px, transparent 1px),
              linear-gradient(90deg, hsl(180 50% 60% / 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        <AnimatedBlob className="top-1/4 right-0" delay={1} size="w-96 h-96" style={{ background: 'hsl(270 60% 70% / 0.25)' }} />
        <AnimatedBlob className="bottom-1/4 left-0" delay={3} size="w-80 h-80" style={{ background: 'hsl(180 50% 60% / 0.25)' }} />
        <AnimatedBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={2} size="w-64 h-64" style={{ background: 'hsl(200 60% 65% / 0.2)' }} />
        
        <div className="relative z-10">
          <PageHeader
            title="The iSpora Spiral"
            description="Our spiraling empowerment model creates a self-reinforcing cycle of impact"
          />
        
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: safeTransition({ staggerChildren: 0.15, delayChildren: 0.2 })
            }
          }}
        >
          <SpiralCard
            index={0}
            title="Empowered Youth"
            description="Youth in the Global South gain access to mentorship, opportunities, training, and support for their initiatives. They develop skills, build networks, and create local impact."
            icon={<GraduationCap className="h-7 w-7" />}
            variant="default"
          />
          <SpiralCard
            index={1}
            title="Activated Diaspora"
            description="Diaspora professionals contribute expertise, resources, and connections. They mentor, co-create initiatives, and bridge global knowledge with local context."
            icon={<Network className="h-7 w-7" />}
            variant="blue"
          />
          <SpiralCard
            index={2}
            title="Institutional Partners"
            description="Governments, NGOs, universities, and foundations partner with iSpora to access curated networks, co-design programs, and scale impact initiatives."
            icon={<Building className="h-7 w-7" />}
            variant="accent"
          />
        </motion.div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={safeTransition({ delay: 0.5 })}
          >
            <p className="text-muted-foreground italic">
              Each group strengthens the others, creating a spiral of increasing empowerment and impact over time.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* What is iSpora? */}
      <Section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(220 100% 94%) 50%, hsl(220 100% 96%) 100%)'
        }}
      >
        <FloatingIcon 
          icon={<Globe className="h-6 w-6" />} 
          className="absolute top-20 right-10" 
          delay={0}
        />
        <FloatingIcon 
          icon={<Network className="h-6 w-6" />} 
          className="absolute bottom-20 left-10" 
          delay={1.5}
        />
        
        <div className="relative z-10">
          <PageHeader
            title="What is iSpora?"
            align="left"
          />
          
          <div className="max-w-4xl">
            <motion.div 
              className="space-y-6 text-lg text-muted-foreground leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: safeTransition({ duration: 0.6 })
                }
              }}
            >
              <p>
                We are building a movement, a network, and a platform to inspire, amplify, and unify diaspora and home-based efforts toward the transformation of Global South nations.
              </p>
              <p>
                Across the Global South — from Africa to Latin America, the Caribbean, Asia, the Middle East, and Oceania — countless organizations and individuals are already doing meaningful work. However, their efforts remain largely fragmented, limiting scale and collective impact.
              </p>
              <p className="font-semibold text-foreground">
                We believe transformation accelerates when efforts are coordinated.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* For whom? */}
      <Section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(220 100% 95%) 0%, hsl(0 0% 100%) 50%, hsl(220 100% 93%) 100%)'
        }}
      >
        <AnimatedDots />
        <div className="relative z-10">
          <PageHeader
            title="For whom?"
            description="iSpora serves three core audiences, each with distinct pathways to engagement"
          />

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: safeTransition({ delay: 0.1, duration: 0.5 })
              }
            }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <motion.div 
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary"
                    whileHover={safeAnimate({ scale: 1.1, rotate: 5 })}
                  transition={safeTransition({ type: "spring", stiffness: 400 })}
                >
                  <Users className="h-7 w-7" />
                </motion.div>
                <CardTitle className="text-xl font-bold">For Youth</CardTitle>
                <CardDescription className="text-base">
                  Local Community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Students and young professionals in the Global South seeking mentorship, opportunities, training, and support for community initiatives.
                </p>
                <Button
                  variant="outline"
                  onClick={() => onPageChange('community')}
                  className="w-full"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: safeTransition({ delay: 0.2, duration: 0.5 })
              }
            }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-primary bg-primary text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <CardHeader>
                  <motion.div 
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm"
                    whileHover={safeAnimate({ scale: 1.15, rotate: 360 })}
                    transition={safeTransition({ type: "spring", stiffness: 400 })}
                  >
                    <Globe className="h-7 w-7" />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-white">For Diasporans Abroad</CardTitle>
                  <CardDescription className="text-base text-white/90">
                    Diaspora Network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Diaspora students and professionals abroad with roots in the Global South, ready to mentor, co-create, and support development initiatives.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => onPageChange('community')}
                    className="w-full bg-white text-primary hover:bg-white/90"
                  >
                    Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: safeTransition({ delay: 0.3, duration: 0.5 })
              }
            }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <motion.div 
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary"
                  whileHover={safeAnimate({ scale: 1.1, rotate: 5 })}
                  transition={safeTransition({ type: "spring", stiffness: 400 })}
                >
                  <Building className="h-7 w-7" />
                </motion.div>
                <CardTitle className="text-xl font-bold">For Partners & Institutions</CardTitle>
                <CardDescription className="text-base">
                  Strategic Partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Governments, NGOs, universities, foundations, and diaspora organizations seeking to partner with iSpora for program design and impact initiatives.
                </p>
                <Button
                  variant="outline"
                  onClick={() => onPageChange('partners')}
                  className="w-full"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        </div>
      </Section>

      {/* Manifesto / Vision */}
      <Section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, hsl(220 100% 94%) 0%, hsl(220 67% 90%) 50%, hsl(220 100% 93%) 100%)'
        }}
      >
        <AnimatedGrid />
        <AnimatedBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10" delay={0} size="w-[600px] h-[600px]" />
        
        <div className="relative z-10">
          <PageHeader
            title="Our Vision"
            description="Imagine a unified space where"
          />

          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: safeTransition({ staggerChildren: 0.1, delayChildren: 0.2 })
              }
            }}
          >
            {[
            'Impact-driven initiatives across the Global South are concentrated, visible, and empowered.',
            'Youths and everyday citizens can discover opportunities locally and globally — and be inspired to create new ones for others.',
            'Academic institutions reconnect and collaborate with their alumni in the diaspora.',
            'Established and nascent youth-led organizations making real impact locally can be seen, supported, and scaled.',
            'Diaspora knowledge, experience, and expertise are channeled into development in a meaningful, measurable way.',
            'Impactful diasporans, leaders, and organizations are spotlighted, supported and celebrated.'
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-card border hover:border-primary/20 transition-colors"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: safeTransition({ duration: 0.4 })
                }
              }}
              >
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">{item}</p>
            </motion.div>
          ))}
          
          <motion.div
            className="mt-8 text-center"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: safeTransition({ delay: 0.6 })
              }
            }}
          >
            <p className="text-lg font-semibold text-foreground mb-4">
              This is what we are building.
            </p>
            <p className="text-muted-foreground">
              iSpora is building that ecosystem — a movement, a global network, and a digital platform powering unified action for Global South transformation.
            </p>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Become a Partner Section */}
      <Section 
        className="relative"
        style={{
          background: 'linear-gradient(135deg, hsl(220 100% 92%) 0%, hsl(220 67% 88%) 50%, hsl(220 100% 91%) 100%)'
        }}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: safeTransition({ duration: 0.6 })
            }
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Become a Partner / Collaborator
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            iSpora is building a coalition of diaspora innovators, global institutions, and impact-driven organizations dedicated to reshaping the future of the Global South. Together, we can accelerate change.
          </p>
          <CTAGroup
            ctas={[
              {
                label: 'Learn about Partnerships',
                onClick: () => onPageChange('partners'),
                variant: 'outline'
              },
              {
                label: 'Become a Partner',
                onClick: () => onPageChange('partners', 'partnership-form'),
                variant: 'primary'
              }
            ]}
            layout="row"
            align="center"
          />
        </motion.div>
      </Section>
    </div>
  );
}
