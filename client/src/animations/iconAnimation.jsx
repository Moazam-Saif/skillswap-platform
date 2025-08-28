import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGuitar, faTableTennisPaddleBall, faBicycle, faBook, faCamera, faChess, faCode, faDrum,
  faFootball, faGamepad, faHeadphones, faLeaf, faPaintBrush, faRocket, faSwimmer, faUtensils
} from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { 
  setIconAnimationActive, 
  swapIconIndices, 
  setNewRandomIcons 
} from "../store/animationSlice.jsx";

const iconList = [
  faGuitar, faTableTennisPaddleBall, faBicycle, faBook,
  faCamera, faChess, faCode, faDrum,
  faFootball, faGamepad, faHeadphones, faLeaf,
  faPaintBrush, faRocket, faSwimmer, faUtensils
];

export default function IconAnimation({ direction, isMobile = false }) {
  const iconRef = useRef(null);
  const dispatch = useDispatch();
  const iconAnimationActive = useSelector(state => state.animation.iconAnimationActive);
  const iconIndices = useSelector(state => state.animation.iconIndices);

  useEffect(() => {
    if (!iconAnimationActive) return;
    
    // Only the left icon controls the sequence to avoid duplication
    if (direction !== "left") return;

    let timeout1, timeout2;
    const moveDistance = isMobile ? 40 : 80;

    const runSequence = () => {
      // 1. Pop out both icons (scale 0)
      gsap.to(".icon-animation", {
        scale: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          // 2. Swap the shared icon indices
          dispatch(swapIconIndices());
          
          // 3. Pop in with swapped icons (scale 1)
          setTimeout(() => {
            gsap.fromTo(
              ".icon-animation",
              { scale: 0 },
              { scale: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
            
            // 4. Wait, then swipe out
            timeout1 = setTimeout(() => {
              gsap.to(".icon-animation", {
                x: (index, target) => {
                  const isLeft = target.classList.contains('icon-left');
                  return isLeft ? moveDistance : -moveDistance;
                },
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                  // 5. Set new random icons
                  dispatch(setNewRandomIcons());

                  // 6. Swipe in with new icons
                  gsap.fromTo(
                    ".icon-animation",
                    { 
                      x: (index, target) => {
                        const isLeft = target.classList.contains('icon-left');
                        return isLeft ? -moveDistance : moveDistance;
                      }, 
                      opacity: 0 
                    },
                    {
                      x: 0,
                      opacity: 1,
                      duration: 0.4,
                      ease: "back.out(1.7)",
                      onComplete: () => {
                        // 7. Wait, then end animation
                        timeout2 = setTimeout(() => {
                          dispatch(setIconAnimationActive(false));
                        }, 2000);
                      }
                    }
                  );
                }
              });
            }, 2000);
          }, 0);
        }
      });
    };

    runSequence();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [iconAnimationActive, direction, dispatch, isMobile]);

  // Pick icon for this side from shared state
  const icon = direction === "left"
    ? iconList[iconIndices[0]]
    : iconList[iconIndices[1]];

  return (
    <FontAwesomeIcon
      ref={iconRef}
      icon={icon}
      className={`icon-animation icon-${direction} text-white ${isMobile ? 'text-5xl' : 'text-7xl'}`}
      style={{ transform: "scale(1)" }}
    />
  );
}