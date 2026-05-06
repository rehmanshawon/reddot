import { useEffect, useState } from "react";

export default function HeroVideo() {
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTagline(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-video">
      <video
        className="hero-video__player"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80"
      >
        {/* Replace with your actual video file path */}
        <source src="/hero-reel.mp4" type="video/mp4" />
      </video>

      {/* Center overlay — only paragraph + scroll */}
      <div className="hero-video__overlay">
        <p>
          RED DOT crafts premium advertising films for television, YouTube, and
          Facebook.
        </p>
        <span className="hero-video__scroll">SCROLL ↓</span>
      </div>

      {/* Animated H1 tagline — appears after 4 seconds on the left */}
      <div
        className={`hero-tagline${showTagline ? " hero-tagline--visible" : ""}`}
      >
        <h1>WE TURN BRAND STORIES INTO MOVING IMAGES.</h1>
      </div>
    </section>
  );
}
