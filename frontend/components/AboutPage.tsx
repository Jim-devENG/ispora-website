import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { FloatingShapes, AnimatedBlob, FloatingIcon } from './animations/FloatingElements';
import { AnimatedDots, AnimatedGrid } from './animations/AnimatedBackground';
import { 
  Heart, 
  Globe, 
  Target, 
  Users, 
  Lightbulb,
  Award,
  Calendar,
  MapPin,
  Linkedin,
  Twitter,
  Mail,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Network,
  Rocket,
  CheckCircle,
  Earth,
  Building,
  BookOpen,
  Briefcase,
  Zap,
  Shield,
  Handshake,
  Star,
  BarChart3,
  Clock,
  Flag,
  Layers
} from 'lucide-react';
import { Section } from './layout/Section';
import { PageHeader } from './layout/PageHeader';
import { safeAnimate, safeTransition } from './utils/animationUtils';
import { cn } from './ui/utils';

interface AboutPageProps {
  onPageChange: (page: string, scrollTarget?: string) => void;
}

export function AboutPage({ onPageChange }: AboutPageProps) {
  const teamMembers = [
    {
      name: 'Oluwaseyi Olawale',
      role: 'Co-Founder & Lead Visionary',
      bio: 'Oluwaseyi is a serial entrepreneur and founder of Genomac Holdings, a thriving biotechnology company driving innovation across the Global South and beyond. As the lead visionary behind the iSpora digital app, he provides strategic oversights and foundational support that sustain the evolution of the iSpora vision. His Genomac Innovation Hub, a subsidiary of Genomac Holdings, currently offers workspace, personnel, and strategic backing to iSpora—serving as a key engine supporting the platform\'s development.',
      initials: 'OO',
      avatarSrc: '/Mr Seyi.jpg',
      linkedin: 'https://www.linkedin.com/in/oluwaseyi-olawale-b9310a82/'
    },
    {
      name: 'Elijah Jesuseye Ogunyale',
      role: 'Co-Founder & CEO',
      bio: 'Elijah is a passionate youth leader and founder of EmQuip Leadership Trainers & Development Partners Limited, with a bold vision for Global South leadership transformation. His unique passion for the Global South Diaspora, leadership development, and national growth fuels iSpora\'s mission. As the founding CEO of iSpora, he drives community-building, leadership, and strategic ideation, shaping the movement and ensuring its alignment with the broader vision of Global South development.',
      initials: 'EO',
      avatarSrc: '/Mr Elijah.jpg',
      linkedin: 'https://www.linkedin.com/in/elijah-suigeneris/'
    },
    {
      name: 'James Enietan',
      role: 'Co-Founder & Chief Technology Officer (CTO)',
      bio: 'James Enietan is a multi-disciplinary builder — a software developer, brand architect, and founder shaping people, platforms, and products. With over a decade in tech, he has designed systems, built digital products, and advised initiatives across faith, leadership, and execution. He leads Teqxure, a solutions company evolving into a builder ecosystem, and founded Kingdom Light Bearers, a discipleship movement equipping believers to influence culture. He also co-founded Crysgarage, an online sound-mastering platform, and established The VisionSmith, a productivity and influence community. His work spans spiritual leadership, tech innovation, and organizational development — focused on building people and systems that outlast him.',
      initials: 'JE',
      avatarSrc: '/Mr Jimmy.png',
      linkedin: 'https://www.linkedin.com/in/enietan-jimmy/'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section 
        className="relative overflow-hidden pt-24 pb-20 sm:pt-32"
        style={{
          background: 'linear-gradient(135deg, hsl(220 100% 94%) 0%, hsl(220 100% 92%) 50%, hsl(220 100% 95%) 100%)'
        }}
      >
        <AnimatedBlob className="top-0 left-0 bg-primary/15" delay={0} size="w-96 h-96" />
        <AnimatedBlob className="bottom-0 right-0 bg-secondary/15" delay={2} size="w-80 h-80" />
        <AnimatedDots />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: safeTransition({ duration: 0.6 })
              }
            }}
          >
            <Badge className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-2" />
              Building the Future Together
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              iSpora was founded on the belief that Global South Diasporans possess immense potential to drive real, lasting transformation in their nations—and that this potential can be most effectively harnessed through an ecosystem that enables seamless collaboration with local and international organizations already working for progress.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary/10">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Global Impact</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary/10">
                <Network className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Diaspora Network</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary/10">
                <Rocket className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Innovation Hub</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Statistics Section */}
      <Section className="relative py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: Users, value: '500+', label: 'Active Members', color: 'text-blue-600' },
            { icon: Building, value: '50+', label: 'Partner Organizations', color: 'text-green-600' },
            { icon: Globe, value: '30+', label: 'Countries Represented', color: 'text-purple-600' },
            { icon: Target, value: '100+', label: 'Impact Projects', color: 'text-orange-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: safeTransition({ delay: index * 0.1, duration: 0.5 })
                }
              }}
              className="text-center"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className={`flex justify-center mb-4 ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section 
        className="relative py-20"
        style={{
          background: 'linear-gradient(180deg, hsl(220 67% 94%) 0%, hsl(0 0% 100%) 50%, hsl(220 100% 95%) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
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
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
              What Drives Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mission & Vision</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: safeTransition({ duration: 0.6 })
                }
              }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-lg">
                      <Target className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground leading-relaxed">
                        Aligned with <strong className="text-foreground">SDG 17: Partnerships for the Goals</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground leading-relaxed">
                        Building bridges between Diaspora communities, institutions, governments, youth-led initiatives, and impact-driven organizations across the Global South.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: safeTransition({ duration: 0.6, delay: 0.1 })
                }
              }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-secondary/20 hover:border-secondary/40 bg-gradient-to-br from-secondary/5 via-background to-secondary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/5 rounded-br-full -ml-16 -mt-16" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary shadow-lg">
                      <Earth className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl">Our Goal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Rocket className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground leading-relaxed">
                        Create an ecosystem that strengthens collaboration between Global South organizations and their Diaspora counterparts.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Rocket className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground leading-relaxed">
                        As the <strong className="text-foreground">Global Impact Engine</strong>, we foster partnerships among organizations that share a common vision, enabling far-reaching and sustainable impact.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Why We Exist */}
      <Section 
        className="relative py-20"
        style={{
          background: 'linear-gradient(90deg, hsl(220 100% 94%) 0%, hsl(220 67% 90%) 50%, hsl(220 100% 93%) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why iSpora Exists</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We recognize that countless youth-led initiatives across the Global South are making meaningful change in their communities yet lack the visibility, support, and resources needed to scale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Amplify Impact',
                description: 'Spotlight youth-led initiatives and amplify their work to reach a global audience.',
                color: 'from-yellow-500/20 to-orange-500/20'
              },
              {
                icon: Handshake,
                title: 'Build Partnerships',
                description: 'Connect local organizations with diaspora professionals and international partners.',
                color: 'from-blue-500/20 to-cyan-500/20'
              },
              {
                icon: TrendingUp,
                title: 'Scale Growth',
                description: 'Provide resources, mentorship, and support to help initiatives scale effectively.',
                color: 'from-green-500/20 to-emerald-500/20'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: safeTransition({ delay: index * 0.1, duration: 0.5 })
                  }
                }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/30 bg-gradient-to-br from-background to-primary/5">
                  <CardContent className="pt-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} mb-4`}>
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Core Values */}
      <Section className="relative py-20 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
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
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
              Our Foundation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at iSpora
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Empathy', description: 'Understanding the unique challenges and opportunities in the Global South' },
              { icon: Shield, title: 'Integrity', description: 'Transparent, ethical, and accountable in all our partnerships' },
              { icon: Zap, title: 'Innovation', description: 'Embracing creative solutions to complex development challenges' },
              { icon: Network, title: 'Collaboration', description: 'Believing that together we achieve far more than alone' }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: safeTransition({ delay: index * 0.1, duration: 0.5 })
                  }
                }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30 bg-white/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <value.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Meet the Founding Team */}
      <Section 
        className="relative py-20"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(220 100% 95%) 50%, hsl(220 100% 96%) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
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
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
              <Users className="h-3 w-3 mr-2" />
              Leadership Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Founding Team</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              iSpora was co-founded by three visionaries united by a shared commitment to the transformation of the Global South.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
          <motion.div 
              key={member.name}
            initial="hidden"
            whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: safeTransition({ delay: index * 0.1, duration: 0.5 })
                }
              }}
            >
              <Card className={cn(
                "h-full hover:shadow-xl transition-all duration-300 border-2 relative overflow-hidden",
                index === 1 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                  : "border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-background"
              )}>
                {index === 1 && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16" />
                )}
                <div className={cn("relative z-10", index === 1 && "text-white")}>
                  <CardHeader>
                    <div className="flex flex-col items-center text-center mb-4">
                      <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20 overflow-hidden">
                        {member.avatarSrc && (
                          <AvatarImage
                            src={member.avatarSrc}
                            alt={member.name}
                            className="object-cover object-top"
                          />
                        )}
                        <AvatarFallback className={cn(
                          "text-2xl font-bold",
                          index === 1 
                            ? "bg-white/20 text-white backdrop-blur-sm" 
                            : "bg-gradient-to-r from-primary to-secondary text-white"
                        )}>
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className={cn("text-xl font-bold", index === 1 && "text-white")}>
                        {member.name}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "mt-2 font-medium",
                          index === 1 && "bg-white/20 text-white border-white/30"
                        )}
                      >
                        {member.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      index === 1 ? "text-white/90" : "text-muted-foreground"
                    )}>
                      {member.bio}
                    </p>
                    {member.linkedin && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full",
                            index === 1 && "border-white/30 text-white hover:bg-white/10"
                          )}
                          onClick={() => window.open(member.linkedin, '_blank')}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn Profile
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section 
        className="relative py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center"
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
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-2xl">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="flex justify-center mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Join Us in Building the Future
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  Whether you're a youth leader, diaspora professional, or impact-driven organization, 
                  there's a place for you in the iSpora ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="default"
                    onClick={() => onPageChange('join')}
                    className="h-12 px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    Join Our Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onPageChange('partners', 'partnership-form')}
                    className="h-12 px-8 border-2 hover:bg-primary/10 transition-all"
                  >
                    Become a Partner
                    <Handshake className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
