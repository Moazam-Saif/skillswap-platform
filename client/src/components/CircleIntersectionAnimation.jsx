import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  startAnimation, 
  setIntersected, 
  startLetterAnimation,
  showNextLetter,
  startFadeOut, 
  completeAnimation 
} from '../store/circleAnimationSlice';

export default function CircleIntersectionAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const dispatch = useDispatch();
  
  const { animationPhase, lettersVisible, showContent } = useSelector(state => state.circleAnimation);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Use refs to track current state without causing re-renders
  const currentPhaseRef = useRef('idle');
  const currentLettersRef = useRef(0);
  
  // Update refs when Redux state changes
  useEffect(() => {
    currentPhaseRef.current = animationPhase;
    console.log('Phase updated to:', animationPhase);
  }, [animationPhase]);
  
  useEffect(() => {
    currentLettersRef.current = lettersVisible;
    console.log('Letters visible:', lettersVisible);
  }, [lettersVisible]);
  
  const CIRCLE_RADIUS = 150;
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
            console.log('🚀 Starting animation...');
            setAnimationStarted(true);
            dispatch(startAnimation());
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
  }, [animationStarted, dispatch]);

  // Main animation effect - ONLY depends on canvas setup
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

    // SKILLSWAP letters in single column
    const letters = ['S', 'K', 'I', 'L', 'L', 'S', 'W', 'A', 'P'];

    let animationComplete = false;
    let fadeStartTime = null;
    let circleAlpha = 1;
    let hasTriggered = false;

    const animate = () => {
      const currentPhase = currentPhaseRef.current;
      const currentLetters = currentLettersRef.current;
      
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Phase 1: Move circles towards intersection
      if (currentPhase === 'moving' && !animationComplete) {
        const moveSpeed = 8;
        
        if (circle1.x < finalCircle1X) {
          circle1.x += moveSpeed;
        }
        
        if (circle2.x > finalCircle2X) {
          circle2.x -= moveSpeed;
        }

        if (circle1.x >= finalCircle1X && circle2.x <= finalCircle2X) {
          console.log('🎯 Circles intersected at 20%');
          animationComplete = true;
          circle1.x = finalCircle1X;
          circle2.x = finalCircle2X;
          
          if (!hasTriggered) {
            hasTriggered = true;
            
            console.log('🔄 Setting intersected phase');
            dispatch(setIntersected());
            
            // Start letter animation immediately
            setTimeout(() => {
              console.log('📝 Starting letter animation');
              dispatch(startLetterAnimation());
              
              letters.forEach((letter, index) => {
                setTimeout(() => {
                  console.log(`📝 Showing letter: ${letter}`);
                  dispatch(showNextLetter());
                }, index * 300);
              });
            }, 100);

            // Start fade after 5 seconds
            setTimeout(() => {
              console.log('🌅 Starting fade out');
              dispatch(startFadeOut());
            }, 5000);
          }
        }
      }

      // Fade out phase
      if (currentPhase === 'fading') {
        if (!fadeStartTime) {
          console.log('🌅 Fade animation started');
          fadeStartTime = Date.now();
        }
        
        const fadeProgress = (Date.now() - fadeStartTime) / 1500;
        circleAlpha = Math.max(0, 1 - fadeProgress);
        
        if (circleAlpha <= 0) {
          console.log('✨ Animation completed');
          dispatch(completeAnimation());
          return;
        }
      }

      // ALWAYS draw circles until completed
      if (currentPhase !== 'completed') {
        ctx.globalAlpha = 0.3 * circleAlpha;
        
        // Circle 1
        ctx.beginPath();
        ctx.arc(circle1.x, circle1.y, circle1.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#F4A261';
        ctx.fill();
        
        // Circle 2
        ctx.beginPath();
        ctx.arc(circle2.x, circle2.y, circle2.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#E9C46A';
        ctx.fill();
      }

      // Draw letters
      if (currentLetters > 0 && (currentPhase === 'letterAnimation' || currentPhase === 'fading')) {
        const intersectionCenterX = (circle1.x + circle2.x) / 2;
        const intersectionCenterY = (circle1.y + circle2.y) / 2;

        ctx.globalAlpha = 1 * circleAlpha;
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#264653';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < currentLetters && i < letters.length; i++) {
          const letterY = intersectionCenterY - 160 + (i * 40);
          ctx.fillText(letters[i], intersectionCenterX, letterY);
        }
      }

      ctx.globalAlpha = 1;

      // Continue animation
      if (currentPhase !== 'completed') {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationStarted, canvasSize, dispatch]); // NO phase dependencies!

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: 'transparent',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}