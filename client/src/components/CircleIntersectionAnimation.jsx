import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function CircleIntersectionAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [intersectionArea, setIntersectionArea] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const CIRCLE_RADIUS = 150; // Larger radius for bigger canvas
  const TARGET_INTERSECTION_PERCENT = 20;

  // Calculate distance between two points
  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  // Calculate intersection area using lens formula
  const calculateIntersectionArea = (distance, r1, r2) => {
    if (distance >= r1 + r2) return 0;
    if (distance <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2;

    const part1 = r1 ** 2 * Math.acos((distance ** 2 + r1 ** 2 - r2 ** 2) / (2 * distance * r1));
    const part2 = r2 ** 2 * Math.acos((distance ** 2 + r2 ** 2 - r1 ** 2) / (2 * distance * r2));
    const part3 = 0.5 * Math.sqrt((-distance + r1 + r2) * (distance + r1 - r2) * (distance - r1 + r2) * (distance + r1 + r2));
    
    return part1 + part2 - part3;
  };

  // Find the distance needed for target intersection percentage
  const findTargetDistance = (r1, r2, targetPercent) => {
    const circleArea = Math.PI * r1 ** 2;
    const targetArea = (targetPercent / 100) * circleArea;
    
    let minDistance = 0;
    let maxDistance = r1 + r2;
    const tolerance = 0.1;

    while (maxDistance - minDistance > tolerance) {
      const midDistance = (minDistance + maxDistance) / 2;
      const currentArea = calculateIntersectionArea(midDistance, r1, r2);
      
      if (currentArea > targetArea) {
        minDistance = midDistance;
      } else {
        maxDistance = midDistance;
      }
    }
    
    return (minDistance + maxDistance) / 2;
  };

  // Check if point is in circle intersection
  const isPointInIntersection = (x, y, circle1, circle2) => {
    const dist1 = calculateDistance(x, y, circle1.x, circle1.y);
    const dist2 = calculateDistance(x, y, circle2.x, circle2.y);
    return dist1 <= circle1.radius && dist2 <= circle2.radius;
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer for scroll detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            setAnimationStarted(true);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [animationStarted]);

  useEffect(() => {
    if (!animationStarted || !canvasSize.width || !canvasSize.height) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Calculate target intersection distance
    const targetDistance = findTargetDistance(CIRCLE_RADIUS, CIRCLE_RADIUS, TARGET_INTERSECTION_PERCENT);

    // Initial positions (start from edges of screen)
    const circle1 = { x: -CIRCLE_RADIUS, y: canvasSize.height / 2, radius: CIRCLE_RADIUS };
    const circle2 = { x: canvasSize.width + CIRCLE_RADIUS, y: canvasSize.height / 2, radius: CIRCLE_RADIUS };

    // Final positions for target intersection
    const finalCenterX = canvasSize.width / 2;
    const halfTargetDistance = targetDistance / 2;
    const finalCircle1X = finalCenterX - halfTargetDistance;
    const finalCircle2X = finalCenterX + halfTargetDistance;

    // SKILLSWAP letters arranged in columns
    const letters = [
      ['S', 'K', 'I', 'L', 'L'],
      ['S', 'W', 'A', 'P']
    ];

    let animationComplete = false;

    const animate = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Move circles towards final positions
      if (!animationComplete) {
        const moveSpeed = 12;
        
        if (circle1.x < finalCircle1X) {
          circle1.x += moveSpeed;
        }
        
        if (circle2.x > finalCircle2X) {
          circle2.x -= moveSpeed;
        }

        if (circle1.x >= finalCircle1X && circle2.x <= finalCircle2X) {
          animationComplete = true;
          circle1.x = finalCircle1X;
          circle2.x = finalCircle2X;
        }
      }

      // Calculate current intersection area and percentage
      const distance = calculateDistance(circle1.x, circle1.y, circle2.x, circle2.y);
      const currentIntersectionArea = calculateIntersectionArea(distance, CIRCLE_RADIUS, CIRCLE_RADIUS);
      const circleArea = Math.PI * CIRCLE_RADIUS ** 2;
      const intersectionPercent = (currentIntersectionArea / circleArea) * 100;
      setIntersectionArea(intersectionPercent);

      // Draw circles with transparency
      ctx.globalAlpha = 0.3;
      
      // Circle 1 (only if visible)
      if (circle1.x + CIRCLE_RADIUS > 0) {
        ctx.beginPath();
        ctx.arc(circle1.x, circle1.y, circle1.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#F4A261';
        ctx.fill();
      }
      
      // Circle 2 (only if visible)
      if (circle2.x - CIRCLE_RADIUS < canvasSize.width) {
        ctx.beginPath();
        ctx.arc(circle2.x, circle2.y, circle2.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#E9C46A';
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // Draw letters only in intersection area
      if (intersectionPercent >= 10) {
        ctx.font = 'bold 48px Arial'; // Larger font for bigger canvas
        ctx.fillStyle = '#264653';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const intersectionCenterX = (circle1.x + circle2.x) / 2;
        const intersectionCenterY = (circle1.y + circle2.y) / 2;

        // Draw SKILL column
        const skillStartX = intersectionCenterX - 50;
        letters[0].forEach((letter, index) => {
          const letterX = skillStartX;
          const letterY = intersectionCenterY - 80 + (index * 40);
          
          if (isPointInIntersection(letterX, letterY, circle1, circle2)) {
            ctx.fillText(letter, letterX, letterY);
          }
        });

        // Draw SWAP column
        const swapStartX = intersectionCenterX + 50;
        letters[1].forEach((letter, index) => {
          const letterX = swapStartX;
          const letterY = intersectionCenterY - 60 + (index * 40);
          
          if (isPointInIntersection(letterX, letterY, circle1, circle2)) {
            ctx.fillText(letter, letterX, letterY);
          }
        });
      }

      if (!animationComplete || intersectionPercent > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationStarted, canvasSize]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'transparent',
          pointerEvents: 'none' // Allow clicks to pass through to content below
        }}
      />
    </div>
  );
}