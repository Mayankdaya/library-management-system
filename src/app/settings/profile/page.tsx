
"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfileSettingsPage() {
    return (
        <UserProfile path="/user-profile" />
    );
}
