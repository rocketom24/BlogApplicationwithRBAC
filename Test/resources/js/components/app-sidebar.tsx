import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, PenSquare, FolderPlus,  } from 'lucide-react';
import AppLogo from './app-logo';
import {usePage} from "@inertiajs/react";


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const {auth} = usePage().props;
    const user = auth.user as {id: number, name: string, role: 'admin' |'user' }| null;
    console.log('Auth USer', auth.user);

    const mainNavItems: NavItem[] = user?.role==='admin'? [
    {
        title: 'Blogs',
        href: '/admin/posts',
        icon: PenSquare,
    },

    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderPlus,
    },
    ]: user?.role==='user'? [
     {
        title: 'Blogs',
        href: '/user/posts',
        icon: BookOpen,
    },
]: [];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
