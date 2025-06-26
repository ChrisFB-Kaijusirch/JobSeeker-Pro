import React from "react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarGroupContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarGroupLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarTriggerProps {
  className?: string;
  onClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <div className={cn("flex h-full w-64 flex-col bg-white border-r border-gray-200", className)}>
      {children}
    </div>
  );
};

export const SidebarContent: React.FC<SidebarContentProps> = ({ children, className }) => {
  return (
    <div className={cn("flex-1 overflow-auto p-4", className)}>
      {children}
    </div>
  );
};

export const SidebarGroup: React.FC<SidebarGroupProps> = ({ children, className }) => {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  );
};

export const SidebarGroupContent: React.FC<SidebarGroupContentProps> = ({ children, className }) => {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  );
};

export const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({ children, className }) => {
  return (
    <h3 className={cn("mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide", className)}>
      {children}
    </h3>
  );
};

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, className }) => {
  return (
    <ul className={cn("space-y-1", className)}>
      {children}
    </ul>
  );
};

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ children, className }) => {
  return (
    <li className={cn("", className)}>
      {children}
    </li>
  );
};

export const SidebarMenuButton: React.FC<SidebarMenuItemProps> = ({ children, className }) => {
  return (
    <button className={cn("w-full text-left p-2 hover:bg-gray-100 rounded-md", className)}>
      {children}
    </button>
  );
};

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("p-4 border-b border-gray-200", className)}>
      {children}
    </div>
  );
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children, className }) => {
  return (
    <div className={cn("flex h-screen", className)}>
      {children}
    </div>
  );
};

export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={cn("p-2 hover:bg-gray-100 rounded-md", className)}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
};
