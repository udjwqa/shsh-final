"use client";

import { use } from "react";
import ChatWidget from "../../../../components/ChatWidget";
import { ListingProvider, useListing } from "../../../../components/ListingContext";

interface SlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

function LayoutInner({ children, slug }: { children: React.ReactNode; slug: string }) {
  const { listingId, listing } = useListing();

  // Get first letter of seller name for avatar
  const avatarLetter = listing?.sellerName ? listing.sellerName.charAt(0).toUpperCase() : "U";
  const sellerName = listing?.sellerName || "User";

  return (
    <>
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-spacer" />
        <div className="topbar-right">
          <div className="topbar-messages">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#36a3d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>Nachrichten</span>
          </div>
          <div className="topbar-profile">
            <div className="topbar-avatar-img">
              {avatarLetter}
            </div>
            <span className="topbar-profile-name">{sellerName}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <button className="topbar-post-btn">+ Neue Anzeige aufgeben</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-bar">
        <ul className="nav-list">
          <li className="nav-logo">
            <img src="/site-logo.png" alt="Logo" className="nav-logo-img" />
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link active">
              MARKTPLATZ
              <span className="nav-count">12.695.950</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">IMMOBILIEN</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">AUTO & MOTOR</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">ARBEITSPLÄTZE</a>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      {children}

      {/* Chat Widget */}
      {listingId && <ChatWidget listingId={listingId} />}
    </>
  );
}

export default function SlugLayout({ children, params }: SlugLayoutProps) {
  const { slug } = use(params);
  return (
    <ListingProvider slug={slug}>
      <LayoutInner slug={slug}>{children}</LayoutInner>
    </ListingProvider>
  );
}
