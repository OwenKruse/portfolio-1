"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEventHandler } from "react";

type HashLinkProps = ComponentProps<typeof Link>;

function parseHref(href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;

  const path = href.slice(0, hashIndex).split("?")[0];

  return {
    path: path === "" ? "/" : path,
    hash: href.slice(hashIndex),
  };
}

/**
 * A `next/link` that keeps working when it points at the section you are
 * already on.
 *
 * Next's router treats a navigation to the current URL as a refresh, so a
 * second click on the same in-page anchor (e.g. `/#work` while the URL is
 * already `/#work`) never scrolls to the section again. Only that repeat click
 * needs handling, so everything else still goes through the router.
 */
export function HashLink({ href, onClick, ...props }: HashLinkProps) {
  const pathname = usePathname();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) return;
    if (typeof href !== "string") return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = parseHref(href);
    if (!target || target.path !== pathname) return;
    if (window.location.hash !== target.hash) return;

    const id = decodeURIComponent(target.hash.slice(1));
    const element = id ? document.getElementById(id) : null;
    if (!element) return;

    event.preventDefault();
    // No options so that `scroll-behavior` from globals.css applies, which
    // keeps smooth scrolling and the reduced motion override working.
    element.scrollIntoView();
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
