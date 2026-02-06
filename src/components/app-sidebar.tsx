"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Fingerprint,
  FileSignature,
  Home,
  Layers,
  ArrowRight,
  Keyboard,
  ListChecks,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "UI Overview",
    url: "/ui",
    icon: LayoutDashboard,
  },
  {
    title: "Touch ID",
    url: "/ui/touch-id",
    icon: Fingerprint,
  },
  {
    title: "Signing",
    url: "/ui/signing",
    icon: FileSignature,
  },
  {
    title: "Text Highlighting",
    url: "/ui/text-highlight",
    icon: ArrowRight,
  },
  {
    title: "Keyboard Key",
    url: "/ui/keyboard-key",
    icon: Keyboard,
  },
  {
    title: "Task Card",
    url: "/ui/task-card",
    icon: ListChecks,
  },
  {
    title: "Kanban Board",
    url: "/ui/kanban",
    icon: LayoutDashboard,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Layers className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">OK UI</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
