"use client";

import { useEffect, useRef } from "react";

interface SplineViewerProps {
  url: string;
  className?: string;
}

const SplineViewer = ({ url, className }: SplineViewerProps) => {
  const viewerRef = useRef<any>(null);
  const splineAppRef = useRef<any>(null);

  useEffect(() => {
    // Load the Spline viewer script
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js";
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!viewerRef.current || !splineAppRef.current) return;

      // Get the viewer's bounding rectangle
      const rect = viewerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the viewer
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      // Convert to rotation values (between -1 and 1)
      const rotationX = (y - 0.5) * 2;
      const rotationY = (x - 0.5) * 2;

      // Apply smooth rotation to the model using the Spline application
      splineAppRef.current.setRotation(rotationX * 15, rotationY * 15, 0);
    };

    // Add mouse move event listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Clean up event listener
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Wait for the Spline viewer to load
    const checkSplineLoaded = setInterval(() => {
      if (viewerRef.current && viewerRef.current.spline) {
        splineAppRef.current = viewerRef.current.spline;
        clearInterval(checkSplineLoaded);
      }
    }, 100);

    return () => clearInterval(checkSplineLoaded);
  }, []);

  return (
    <spline-viewer 
      ref={viewerRef}
      loading-anim-type="spinner-small-dark" 
      url={url}
      className={className}
    />
  );
};

export default SplineViewer; 