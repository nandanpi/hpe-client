"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { Shield } from "lucide-react";
export default function Header() {
  return (
    <header className="bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-gray-800 to-gray-900">
                <Shield className="absolute inset-0 h-full w-full p-1.5 text-gray-100" />
              </div>
              <span className="font-heading hidden text-xl font-bold tracking-tight text-gray-900 sm:inline-block">
                SecureURL
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
