"use client"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarContent,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Bell, Brush, User, Settings as SettingsIcon } from 'lucide-react'
import Header from "@/components/Header"
import { usePathname } from "next/navigation"
import Link from "next/link"

const menuItems = [
    { href: "/settings", label: "General", icon: SettingsIcon },
    { href: "/settings/profile", label: "Profile", icon: User },
    { href: "/settings/appearance", label: "Appearance", icon: Brush },
    { href: "/settings/notifications", label: "Notifications", icon: Bell },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-transparent text-foreground font-body">
       <Header />
       <div className="pt-20">
        <SidebarProvider>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                <Sidebar
                    collapsible="none"
                    className="hidden md:flex"
                    variant="inset"
                >
                    <SidebarContent>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <main>{children}</main>
            </div>
        </SidebarProvider>
       </div>
    </div>
  )
}
