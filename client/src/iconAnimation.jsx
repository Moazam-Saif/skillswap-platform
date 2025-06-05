import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGuitar, faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";

export default function IconAnimation({ direction }) {
    const [iconToggle, setIconToggle] = useState(true);
    const iconRef = useRef(null);

    useEffect(() => {
        let timeout1, timeout2, timeout3;

        const runSequence = () => {
            // 1. Pop animation
            gsap.to(iconRef.current, {
                scale: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    setIconToggle(prev => !prev);
                    gsap.fromTo(
                        iconRef.current,
                        { scale: 0 },
                        { scale: 1, duration: 0.4, ease: "back.out(1.7)" }
                    );
                    // 2. Wait 2s, then swipe
                    timeout1 = setTimeout(() => {
                        // 3. Swipe out
                        gsap.to(iconRef.current, {
                            x: direction === "left" ? 80 : -80,
                            opacity: 0,
                            duration: 0.4,
                            ease: "power2.in",
                            onComplete: () => {
                                setIconToggle(prev => !prev); // Switch icon (can use same icon for now)
                                // 4. Swipe in
                                gsap.fromTo(
                                    iconRef.current,
                                    { x: direction === "left" ? -80 : 80, opacity: 0 },
                                    {
                                        x: 0,
                                        opacity: 1,
                                        duration: 0.4,
                                        ease: "back.out(1.7)",
                                        onComplete: () => {
                                            // 5. Wait 1.5s, then repeat
                                            timeout2 = setTimeout(runSequence, 1500);
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
            clearTimeout(timeout3);
        };
    }, [direction]);

    const icon = direction === "left"
        ? (iconToggle ? faGuitar : faTableTennisPaddleBall)
        : (iconToggle ? faTableTennisPaddleBall : faGuitar);

    return (
        <FontAwesomeIcon
            ref={iconRef}
            icon={icon}
            className="text-white text-7xl"
            style={{ transform: "scale(1)" }}
        />
    );
}