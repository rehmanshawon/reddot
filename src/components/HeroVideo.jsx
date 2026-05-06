import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const [showTagline, setShowTagline] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTagline(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play with sound
    video.muted = false;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Success! Audio is playing
          setIsMuted(false);
        })
        .catch(() => {
          // Browser blocked it — fall back to muted
          video.muted = true;
          video.play();
          setIsMuted(true);
        });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="hero-video">
      <video
        ref={videoRef}
        className="hero-video__player"
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80"
      >
        <source src="/hero-reel.mp4" type="video/mp4" />
      </video>

      <button
        type="button"
        className="hero-video__sound"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <div className="hero-video__overlay">
        {/* <p>
          RED DOT crafts premium advertising films for television, YouTube, and
          Facebook.
        </p> */}
        <span className="hero-video__scroll">SCROLL ↓</span>
      </div>

      <div
        className={`hero-tagline${showTagline ? " hero-tagline--visible" : ""}`}
      >
        <h1>WE TURN BRAND STORIES INTO MOVING IMAGES.</h1>
      </div>
    </section>
  );
}
