"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Package, Users, UserCog, Truck, CreditCard, Brain, LayoutDashboard, Settings, LogOut, Route, IceCream2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminNavLinks = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/users', label: 'Manage Users', icon: UserCog },
  { href: '/admin/restock-suggestions', label: 'Restock AI', icon: Brain },
  { href: '/admin/routes-overview', label: 'Routes Overview', icon: Route },
];

const UserNavLinks = [
  { href: '/user/distributions', label: 'Distributions', icon: Truck },
  { href: '/user/payments', label: 'Payments', icon: CreditCard },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = user?.role === 'admin' ? AdminNavLinks : UserNavLinks;

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 py-2 justify-center group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:px-0.5">
          <IceCream2 className="h-8 w-8 text-primary flex-shrink-0" />
          <h2 className="text-2xl font-bold font-headline text-primary group-data-[collapsible=icon]:hidden">
            Yo Cool Central
          </h2>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === (user?.role === 'admin' ? '/admin/products' : '/user/distributions')}
                tooltip={{ children: "Dashboard", side: "right" }}
              >
                <Link href={user?.role === 'admin' ? '/admin/products' : '/user/distributions'}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Management</SidebarGroupLabel>
            <SidebarMenu>
              {navLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname.startsWith(link.href)}
                    tooltip={{ children: link.label, side: "right" }}
                  >
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarSeparator />
      
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              tooltip={{ children: "Settings", side: "right" }}
            >
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
              tooltip={{ children: "Log Out", side: "right" }}
            >
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}