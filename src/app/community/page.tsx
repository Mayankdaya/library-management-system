
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, MessageSquare, ArrowRight, UserPlus, X, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initialMembers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';


export default function CommunityPage() {
    const { toast } = useToast();

    const [events, setEvents] = useState([
        {
            id: 1,
            date: '2024-08-15',
            title: 'Author Q&A with Matt Haig',
            description: 'Join us for a live virtual Q&A session with Matt Haig, author of the bestselling novel "The Midnight Library".',
            image: {
                "src": "https://picsum.photos/seed/event1/600/400",
                "width": 600,
                "height": 400,
                "hint": "author speaking"
            },
            rsvps: [1, 3],
            capacity: 25,
        },
        {
            id: 2,
            date: '2024-09-05',
            title: 'Sci-Fi Writing Workshop',
            description: 'Unleash your inner storyteller in our creative writing workshop focused on the science fiction genre.',
            image: {
                "src": "https://picsum.photos/seed/event2/600/400",
                "width": 600,
                "height": 400,
                "hint": "futuristic city"
            },
            rsvps: [2],
            capacity: 15,
        },
    ]);

    const [bookClubs] = useState([
        {
            name: 'The Page Turners',
            currentBook: 'Project Hail Mary by Andy Weir',
            members: 24,
            image: {
                "src": "https://picsum.photos/seed/club1/600/400",
                "width": 600,
                "height": 400,
                "hint": "group reading"
            }
        },
        {
            name: 'Classic Literature Society',
            currentBook: 'One Hundred Years of Solitude by Gabriel García Márquez',
            members: 15,
            image: {
                "src": "https://picsum.photos/seed/club2/600/400",
                "width": 600,
                "height": 400,
                "hint": "old books"
            }
        }
    ]);

    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    const handleRsvp = (eventId: number) => {
        if (!selectedMemberId) {
            toast({
                variant: 'destructive',
                title: 'No Member Selected',
                description: 'Please select a member to RSVP.',
            });
            return;
        }

        const memberId = parseInt(selectedMemberId, 10);

        setEvents(prevEvents => {
            const newEvents = [...prevEvents];
            const eventIndex = newEvents.findIndex(e => e.id === eventId);
            if (eventIndex === -1) return prevEvents;

            const event = newEvents[eventIndex];
            if (event.rsvps.includes(memberId)) {
                 toast({
                    variant: 'destructive',
                    title: 'Already Registered',
                    description: 'This member has already RSVP\'d for this event.',
                });
                return prevEvents;
            }
            
            if (event.rsvps.length >= event.capacity) {
                toast({
                    variant: 'destructive',
                    title: 'Event Full',
                    description: 'This event has reached its maximum capacity.',
                });
                return prevEvents;
            }

            newEvents[eventIndex] = {
                ...event,
                rsvps: [...event.rsvps, memberId],
            };
            
            const member = initialMembers.find(m => m.id === memberId);
            toast({
                title: 'RSVP Successful!',
                description: `${member?.name} is now registered for "${event.title}".`,
            });
            
            setSelectedMemberId(null);
            // We need a way to close the dialog. Since we can't control it from here directly,
            // we rely on the user to close it or handle it via a shared state if we refactor.
            // For now, this just updates the data. A document event could be a workaround.
            document.dispatchEvent(new Event(`close-dialog-${eventId}`));


            return newEvents;
        });
    };
    
    const getMemberName = (memberId: number) => initialMembers.find(m => m.id === memberId)?.name || 'Unknown Member';
    const getMemberInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    return (
        <TooltipProvider>
        <div className="min-h-screen bg-transparent text-foreground font-body">
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60 font-headline">
                        Community Hub
                    </h1>
                    <p className="mt-4 font-normal text-base text-neutral-300 max-w-2xl mx-auto">
                        Connect with fellow readers, join clubs, and participate in exclusive library events.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Upcoming Events */}
                    <section>
                        <h2 className="text-3xl font-bold font-headline mb-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">Upcoming Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {events.map((event, index) => {
                                const spotsLeft = event.capacity - event.rsvps.length;
                                const isFull = spotsLeft <= 0;

                                return (
                                <Card key={index} className="glassmorphic overflow-hidden flex flex-col">
                                     <Image 
                                        src={event.image.src} 
                                        alt={event.title}
                                        width={event.image.width}
                                        height={event.image.height}
                                        data-ai-hint={event.image.hint}
                                        className="w-full h-48 object-cover" 
                                    />
                                    <CardHeader>
                                        <CardTitle>{event.title}</CardTitle>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>{event.rsvps.length} / {event.capacity} Attendees</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex flex-col">
                                        <p className="text-muted-foreground mb-4 flex-grow">{event.description}</p>
                                        <div className='space-y-2 mb-4'>
                                            <div className='flex justify-between items-center text-xs text-muted-foreground'>
                                                <span>{isFull ? 'Event Full' : `${spotsLeft} spots left`}</span>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                                            <Users className="h-3 w-3" /> See attendees
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {event.rsvps.length > 0 ? (
                                                            <div className="flex flex-col gap-2 p-1">
                                                                <p className='font-bold text-center'>Attendees</p>
                                                                {event.rsvps.map(id => (
                                                                <div key={id} className="flex items-center gap-2">
                                                                    <Avatar className="h-6 w-6 text-xs">
                                                                        <AvatarFallback>{getMemberInitials(getMemberName(id))}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span>{getMemberName(id)}</span>
                                                                </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p>No one has RSVP'd yet.</p>
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <Progress value={(event.rsvps.length / event.capacity) * 100} className="h-2" />
                                        </div>

                                        <Dialog onOpenChange={(open) => { if (!open) setSelectedMemberId(null); }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" disabled={isFull}>
                                                    {isFull ? 'Event Full' : 'RSVP Now'} <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="glassmorphic">
                                                <DialogHeader>
                                                    <DialogTitle>RSVP for: {event.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4">
                                                    <p className="text-muted-foreground">Select a library member to register for this event.</p>
                                                    <Select onValueChange={setSelectedMemberId}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a member..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {initialMembers.map(member => (
                                                                <SelectItem key={member.id} value={member.id.toString()} disabled={event.rsvps.includes(member.id)}>
                                                                    <div className="flex items-center justify-between w-full">
                                                                        <span>{member.name}</span>
                                                                        {event.rsvps.includes(member.id) && (
                                                                            <span className="text-xs text-muted-foreground ml-2">(Already RSVP'd)</span>
                                                                        )}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="ghost">Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={() => handleRsvp(event.id)} disabled={!selectedMemberId}>
                                                        <UserPlus className="mr-2 h-4 w-4" /> Confirm RSVP
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                    </CardContent>
                                </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* Book Clubs */}
                    <section>
                         <h2 className="text-3xl font-bold font-headline mb-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">Find Your Book Club</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {bookClubs.map((club, index) => (
                                <Card key={index} className="glassmorphic">
                                     <CardHeader>
                                        <CardTitle>{club.name}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                             <div className='flex items-center gap-2'><Users className="h-4 w-4" /> {club.members} Members</div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground font-semibold">Currently Reading:</p>
                                        <p className="text-foreground italic mb-4">{club.currentBook}</p>
                                        <Button>Join Club <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                    
                    {/* Discussion Forums */}
                    <section>
                        <h2 className="text-3xl font-bold font-headline mb-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">Discussion Forums</h2>
                        <Card className="glassmorphic">
                             <CardHeader>
                                <CardTitle>Featured Discussion</CardTitle>
                                <CardDescription>What are your thoughts on the ending of "The Silent Patient"?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-t border-border pt-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">A</div>
                                        <div className='flex-1'>
                                            <p className='font-semibold'>Alex J.</p>
                                            <p className="text-muted-foreground">I was completely shocked! I did not see that twist coming at all. What a masterpiece of suspense.</p>
                                        </div>
                                     </div>
                                      <div className="flex items-start gap-4 mt-4 ml-8">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">S</div>
                                        <div className='flex-1'>
                                            <p className='font-semibold'>Samantha L.</p>
                                            <p className="text-muted-foreground">Replying to Alex J.</p>
                                            <p className="text-muted-foreground">Right?! I had to go back and re-read the last few chapters to see all the clues I missed.</p>
                                        </div>
                                     </div>
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <Button><MessageSquare className="mr-2 h-4 w-4" /> Join Discussion</Button>
                                    <Button variant="outline">View All Forums</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </div>
        </TooltipProvider>
    );
}

    