"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../layout/container";
import { cn } from "../../lib/utils";
import NavItems from "./nav-items";
import { useLayout } from "../layout/layout-context";

export default function Header() {
  const { globalSettings, theme } = useLayout();
  const header = globalSettings.header;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b bg-[#472B49] text-white`}
    >
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <div className="flex items-center justify-between gap-6">
          <h4 className="select-none text-lg font-bold tracking-tight my-4 transition duration-150 ease-out transform">
            <Link
              href="/"
              className="flex gap-1 items-center whitespace-nowrap tracking-[.002em]"
            >
              <Image alt={''} src="https://assets.tina.io/4c56b08b-ff46-4470-b58a-44777f9310dd/logo.png" width={130} height={30} />
            </Link>
          </h4>
          <NavItems navs={header.nav} />
        </div>
        <div
          className={cn(
            `absolute h-1 bg-gradient-to-r from-transparent`,
            theme.darkMode === "primary"
              ? `via-white`
              : `via-black dark:via-white`,
            "to-transparent bottom-0 left-4 right-4 -z-1 opacity-5"
          )}
        />
      </Container>
    </div>
  );
}
