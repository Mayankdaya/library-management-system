import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, MessageSquare, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CommunityPage() {

    const events = [
        {
            date: '2024-08-15',
            title: 'Author Q&A with Matt Haig',
            description: 'Join us for a live virtual Q&A session with Matt Haig, author of the bestselling novel "The Midnight Library".',
            image: {
                "src": "https://picsum.photos/seed/event1/600/400",
                "width": 600,
                "height": 400,
                "hint": "author speaking"
            }
        },
        {
            date: '2024-09-05',
            title: 'Sci-Fi Writing Workshop',
            description: 'Unleash your inner storyteller in our creative writing workshop focused on the science fiction genre.',
            image: {
                "src": "https://picsum.photos/seed/event2/600/400",
                "width": 600,
                "height": 400,
                "hint": "futuristic city"
            }
        },
    ];

    const bookClubs = [
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
    ]

    return (
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
                            {events.map((event, index) => (
                                <Card key={index} className="glassmorphic overflow-hidden">
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
                                        <CardDescription className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{event.description}</p>
                                        <Button variant="outline">RSVP Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                    </CardContent>
                                </Card>
                            ))}
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
    );
}