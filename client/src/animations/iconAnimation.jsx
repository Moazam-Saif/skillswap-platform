import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGuitar, faTableTennisPaddleBall, faBicycle, faBook, faCamera, faChess, faCode, faDrum,
  faFootball, faGamepad, faHeadphones, faLeaf, faPaintBrush, faRocket, faSwimmer, faUtensils
} from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { setIconAnimationActive } from "../store/animationSlice.jsx";

const iconList = [
  faGuitar, faTableTennisPaddleBall, faBicycle, faBook,
  faCamera, faChess, faCode, faDrum,
  faFootball, faGamepad, faHeadphones, faLeaf,
  faPaintBrush, faRocket, faSwimmer, faUtensils
];

// Helper to get two new random indices, not equal to each other or the previous two
function getTwoRandomIndices(prevIndices) {
  let available = iconList.map((_, i) => i).filter(i => !prevIndices.includes(i));
  let first = available[Math.floor(Math.random() * available.length)];
  let available2 = available.filter(i => i !== first);
  let second = available2[Math.floor(Math.random() * available2.length)];
  return [first, second];
}

export default function IconAnimation({ direction }) {
  // iconIndices: [left, right]
  const [iconIndices, setIconIndices] = useState([0, 1]);
  const prevIndices = useRef([0, 1]);
  const iconRef = useRef(null);
  const dispatch = useDispatch();
  const iconAnimationActive = useSelector(state => state.animation.iconAnimationActive);

  useEffect(() => {
    if (!iconAnimationActive) return;

    let timeout1, timeout2;

    const runSequence = () => {
      // 1. Pop out (scale 0)
      gsap.to(iconRef.current, {
        scale: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          // 2. Swap left/right icons (ALWAYS swap, not random)
          setIconIndices(([left, right]) => [right, left]);
          // 3. Pop in (scale 1)
          gsap.fromTo(
            iconRef.current,
            { scale: 0 },
            { scale: 1, duration: 0.4, ease: "back.out(1.7)" }
          );
          // 4. Wait, then swipe out
          timeout1 = setTimeout(() => {
            gsap.to(iconRef.current, {
              x: direction === "left" ? 80 : -80,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
              onComplete: () => {
                // 5. Pick two new random icons for swipe in (NOT EQUAL TO EACH OTHER OR PREVIOUS)
                const newIndices = getTwoRandomIndices(prevIndices.current);
                setIconIndices(newIndices);
                prevIndices.current = newIndices;

                // 6. Swipe in
                gsap.fromTo(
                  iconRef.current,
                  { x: direction === "left" ? -80 : 80, opacity: 0 },
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
        }
      });
    };

    runSequence();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [iconAnimationActive, direction, dispatch]);

  // Pick icon for this side
  const icon = direction === "left"
    ? iconList[iconIndices[0]]
    : iconList[iconIndices[1]];

  return (
    <FontAwesomeIcon
      ref={iconRef}
      icon={icon}
      className="text-white text-7xl"
      style={{ transform: "scale(1)" }}
    />
  );
}