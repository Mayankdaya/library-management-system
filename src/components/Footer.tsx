
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full z-10 p-8 glassmorphic mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg font-headline mb-4">Verdant Library</h3>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Verdant Library. All Rights Reserved.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg font-headline mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/catalog" className="text-sm hover:text-primary transition-colors">Catalog</Link></li>
              <li><Link href="/members" className="text-sm hover:text-primary transition-colors">Members</Link></li>
              <li><Link href="/community" className="text-sm hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-bold text-lg font-headline mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/settings/profile" className="text-sm hover:text-primary transition-colors">My Profile</Link></li>
              <li><Link href="/checkout" className="text-sm hover:text-primary transition-colors">Checkout</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Reservations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg font-headline mb-4">Follow Us</h3>
             <div className="flex justify-center md:justify-start space-x-4">
                <Link href="#" className="hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 9.6 0 7.1-4.3 11.7-11.6 11.7-5.8 0-10-3.8-11.5-6.5C2.5 16.5 4.1 18 7.8 18c2.3 0 4.3-.8 6.1-2.1C11.1 16.2 9 13.5 8.1 11.5c.8.1 1.5.2 2.3.2 1.3 0 2.4-.3 3.3-.9C10.5 9.7 9 7.1 9 4.5 9.2 4.4 11.4 5.6 11.4 5.6S10 2.1 13.1 2.1c2.1 0 4.1 1.4 4.1 4.1 0 0 .5-1.7 2.8-2.1z"/></svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                 <Link href="#" className="hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span className="sr-only">Instagram</span>
                </Link>
             </div>
          </div>
        </div>
      </footer>
  )
}
