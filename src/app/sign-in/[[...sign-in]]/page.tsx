
'use client';

import AuthForm from "@/components/AuthForm";
import { BookMarkedIcon } from "@/components/Header";
import Link from 'next/link';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-transparent text-foreground font-body flex flex-col items-center justify-center p-4">
             <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-3">
                    <BookMarkedIcon className="h-8 w-8 text-foreground" />
                    <h1 className="text-3xl font-headline font-bold">Verdant Library</h1>
                </Link>
            </div>
            <div className="w-full max-w-md">
                <AuthForm mode="login" />
                 <p className="px-8 text-center text-sm text-muted-foreground mt-4">
                    Don't have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Sign up
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
