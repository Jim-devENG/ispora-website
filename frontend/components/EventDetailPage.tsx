/**
 * Event Detail Page
 * 
 * Displays a single event in full detail.
 * Accessed via /event/[id] or /webinar/[id]
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Section } from './layout/Section';
import { safeAnimate, safeTransition } from './utils/animationUtils';
import { FloatingShapes, AnimatedBlob } from './animations/FloatingElements';
import { AnimatedDots } from './animations/AnimatedBackground';
import { fetchJson } from '../src/utils/fetchJson';
import { 
  Calendar, 
  Clock,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Share2,
  Users,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { cn } from './ui/utils';

interface EventDetailPageProps {
  onPageChange: (page: string) => void;
  eventId?: string;
}

export function EventDetailPage({ onPageChange, eventId }: EventDetailPageProps) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!eventId) {
          throw new Error('Event ID is required');
        }

        const response = await fetchJson<{ event: any }>(`/api/events/${eventId}`);
        setEvent(response.event);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Button onClick={() => onPageChange('webinars')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start_at);
  const endDate = event.end_at ? new Date(event.end_at) : null;
  const isPast = startDate < new Date();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Cover Image */}
      <Section 
        className="relative overflow-hidden pt-24 pb-12"
        style={{
          background: 'linear-gradient(135deg, hsl(220 100% 96%) 0%, hsl(220 100% 92%) 50%, hsl(220 100% 95%) 100%)'
        }}
      >
        <AnimatedBlob className="top-0 right-0 bg-primary/15" delay={0} size="w-96 h-96" />
        <AnimatedDots />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => onPageChange('webinars')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          {event.cover_image_url && (
            <motion.div
              className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-xl"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: safeTransition({ duration: 0.6 })
                }
              }}
            >
              <img 
                src={event.cover_image_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: safeTransition({ duration: 0.6, delay: 0.2 })
              }
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge className={cn(
                "bg-primary/10 text-primary border-primary/20",
                isPast && "bg-muted text-muted-foreground"
              )}>
                {isPast ? 'Past Event' : 'Upcoming Event'}
              </Badge>
              {event.status === 'published' && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  Published
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {event.title}
            </h1>

            {/* Event Details */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {startDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm">
                    {startDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                    {endDate && ` - ${endDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}`}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
              )}

              {event.registration_link && (
                <div className="sm:col-span-2">
                  <Button
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <a 
                      href={event.registration_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Register Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: event.description || event.title,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Description Section */}
      {event.description && (
        <Section 
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(220 100% 96%) 50%, hsl(220 100% 98%) 100%)'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="prose prose-lg dark:prose-invert max-w-none"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: safeTransition({ duration: 0.6, delay: 0.3 })
                }
              }}
            >
              <h2 className="text-2xl font-bold mb-6">About This Event</h2>
              <div 
                className={cn(
                  "text-base sm:text-lg leading-relaxed",
                  "prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4",
                  "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
                  "prose-p:text-foreground/90 prose-p:mb-6 prose-p:leading-relaxed",
                  "prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80",
                  "prose-strong:text-foreground prose-strong:font-semibold",
                  "prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-6 prose-ol:ml-6",
                  "prose-li:text-foreground/90 prose-li:mb-2",
                  "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6"
                )}
              >
                {event.description.includes('<') && event.description.includes('>') ? (
                  <div dangerouslySetInnerHTML={{ __html: event.description }} />
                ) : (
                  <div className="whitespace-pre-wrap">{event.description}</div>
                )}
              </div>
            </motion.div>

            {/* Registration CTA */}
            {event.registration_link && (
              <motion.div
                className="mt-12 pt-8 border-t text-center"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: safeTransition({ duration: 0.6, delay: 0.5 })
                  }
                }}
              >
                <h3 className="text-xl font-bold mb-4">Ready to Join?</h3>
                <Button
                  size="lg"
                  asChild
                >
                  <a 
                    href={event.registration_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Register for This Event
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
            )}

            {/* Back to Events Button */}
            <motion.div
              className="mt-8 pt-8 border-t"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: safeTransition({ duration: 0.6, delay: 0.6 })
                }
              }}
            >
              <Button
                variant="outline"
                onClick={() => onPageChange('webinars')}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Button>
            </motion.div>
          </div>
        </Section>
      )}
    </div>
  );
}

