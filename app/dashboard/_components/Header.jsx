"use client";
import { SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot } from "lucide-react";

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [controlNavbar]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/about-us", label: "About us" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 flex justify-between items-center p-4 sm:p-5 bg-gray-950/90 backdrop-blur-md shadow-md z-50 transition-all duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <Bot className="text-indigo-400" size={28} />
          <span className="text-xl sm:text-2xl font-bold text-indigo-400">IntervX</span>
        </Link>

        <nav className="hidden md:flex gap-4 lg:gap-6">
          {navItems.map((item) => (
            <NavItem key={item.href} path={path} href={item.href} label={item.label} onClick={closeMobileMenu} />
          ))}
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none text-gray-400 hover:text-indigo-400 transition-colors">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden md:block">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
          </SignedIn>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-0 bg-gray-950 z-40 md:hidden overflow-hidden pt-16">
          <div className="h-full overflow-y-auto pb-16">
            <nav className="space-y-6 p-6">
              {navItems.map((item) => (
                <NavItem key={item.href} path={path} href={item.href} label={item.label} mobile onClick={closeMobileMenu} />
              ))}
              <div className="pt-6 border-t border-gray-800">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors" onClick={closeMobileMenu}>
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-12 h-12 mx-auto" } }} />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ path, href, label, mobile, onClick }) {
  return (
    <Link href={href} onClick={onClick}
      className={`block transition-all duration-300 ease-in-out cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${mobile ? "w-full text-lg py-3 text-center" : "px-3 py-2 hover:bg-gray-800 hover:text-indigo-400"}
        ${path === href ? "text-indigo-400 font-bold bg-gray-800" : "text-gray-400 hover:text-indigo-400"}`}>
      {label}
    </Link>
  );
}

export default Header;