import React, { useState, useEffect, useId } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { requestAnimation, releaseAnimation, cancelAnimation } from '../store/lockSlice';
import SwapRequest from './SwapRequest';

export const SwapCard = ({ userId, name, imageUrl, skillsTheyOffer = [], skillsTheyWant = [], availability = [] }) => {
    const cardId = useId();
    const dispatch = useDispatch();
    const activeCardId = useSelector(state => state.cardAnimation.activeCardId);
    const isAnimating = activeCardId === cardId;

    const [offerIndex, setOfferIndex] = useState(0);
    const [wantIndex, setWantIndex] = useState(0);
    const [showRequest, setShowRequest] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);

    const shouldAnimate = (skillsTheyOffer.length > 1 || skillsTheyWant.length > 1);

    // Debug log to see what's in state
    console.log('🔍 SwapCard state check:', {
        cardId,
        activeCardId,
        isAnimating,
        shouldAnimate
    });

    // Continuous animation request effect
    useEffect(() => {
        if (!shouldAnimate || !isComponentMounted) return;

        const requestAnimationContinuously = () => {
            console.log('🎯 Requesting animation for card:', cardId);
            dispatch(requestAnimation({ cardId }));
        };

        // Initial request
        requestAnimationContinuously();

        // Re-request animation after a delay when not animating
        let reRequestTimer;
        if (!isAnimating) {
            reRequestTimer = setTimeout(() => {
                if (isComponentMounted && shouldAnimate) {
                    requestAnimationContinuously();
                }
            }, 1000); // Wait 1 second before re-requesting
        }

        return () => {
            clearTimeout(reRequestTimer);
        };
    }, [cardId, shouldAnimate, isAnimating, isComponentMounted, dispatch]);

    // Animation intervals effect
    useEffect(() => {
        console.log('🎯 Animation effect triggered:', { isAnimating, shouldAnimate, cardId });
        
        if (!isAnimating || !shouldAnimate) return;

        let offerInterval, wantInterval;

        if (skillsTheyOffer.length > 1) {
            console.log('🎯 Starting offer interval for card:', cardId);
            offerInterval = setInterval(() => {
                setOfferIndex(prev => {
                    const newIndex = (prev + 1) % skillsTheyOffer.length;
                    console.log('🎯 Offer index changed:', prev, '->', newIndex);
                    return newIndex;
                });
            }, 2000);
        }

        if (skillsTheyWant.length > 1) {
            console.log('🎯 Starting want interval for card:', cardId);
            wantInterval = setInterval(() => {
                setWantIndex(prev => {
                    const newIndex = (prev + 1) % skillsTheyWant.length;
                    console.log('🎯 Want index changed:', prev, '->', newIndex);
                    return newIndex;
                });
            }, 3000);
        }

        // Auto-release after a shorter time to allow cycling
        const autoReleaseTimer = setTimeout(() => {
            console.log('🎯 Auto-releasing animation for card:', cardId);
            dispatch(releaseAnimation({ cardId }));
        }, 3500); // 6 seconds per card

        return () => {
            console.log('🎯 Cleaning up intervals for card:', cardId);
            clearInterval(offerInterval);
            clearInterval(wantInterval);
            clearTimeout(autoReleaseTimer);
        };
    }, [isAnimating, shouldAnimate, skillsTheyOffer.length, skillsTheyWant.length, cardId, dispatch]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setIsComponentMounted(false);
            console.log('🎯 Component unmounting, canceling animation for card:', cardId);
            dispatch(cancelAnimation({ cardId }));
        };
    }, [cardId, dispatch]);

    // Release animation when card becomes inactive
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isAnimating) {
                console.log('🎯 Releasing animation due to visibility change:', cardId);
                dispatch(releaseAnimation({ cardId }));
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAnimating, cardId, dispatch]);

    function getNameBeforeBracket(str = "") {
        const idx = str.search(/[\(\[\{]/);
        return idx === -1 ? str : str.slice(0, idx).trim();
    }

   // ...existing code...

   return (
    <div onClick={() => setShowRequest(true)}>
        {/* Scale down the entire card for mobile while maintaining layout */}
        <div className="w-[140px] h-[135px] sm:w-[179px] sm:h-[173px] relative bg-transparent">
            <div className="w-full h-[95px] sm:h-[122px] rounded-t-[17px] bg-[#E76F51] border-b-2 border-white relative overflow-hidden flex items-center justify-center">
                <img
                    src="/Arrows.svg"
                    alt="Swap Taf"
                    className="w-[25px] h-[12px] sm:w-[34px] sm:h-[17px] scale-[1.5]"
                />

                {/* Left: Skills They Offer */}
                <div className="absolute left-1 top-2 sm:top-3 z-50 w-[24px] sm:w-[31px] h-[78px] sm:h-[100px] flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={skillsTheyOffer?.[offerIndex]?.name}
                            initial={{ x: -70, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 70, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center z-50 transform rotate-90 origin-center text-[0.7rem] sm:text-[min(0.9rem,100%)] text-[#264653] leading-3 font-bold"
                            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                            {getNameBeforeBracket(skillsTheyOffer?.[offerIndex]?.name) || ""}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Right: Skills They Want */}
                <div className="absolute right-1 top-2 sm:top-3 z-50 w-[25px] sm:w-[32px] h-[78px] sm:h-[100px] flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={skillsTheyWant?.[wantIndex]?.name}
                            initial={{ x: -70, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 70, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center z-50 transform -rotate-90 origin-center text-[0.7rem] sm:text-[min(0.9rem,100%)] text-[#264653] leading-3 font-bold"
                            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                            {getNameBeforeBracket(skillsTheyWant?.[wantIndex]?.name) || ""}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Decorations - scaled proportionally */}
                <div
                    className="absolute left-[-52px] sm:left-[-67px] top-0 h-[95px] sm:h-[122px] w-[98px] sm:w-[128px] flex items-end"
                    style={{
                        backgroundImage: "url('/LeftEllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                    }}
                />
                <div className="absolute left-0 bottom-0 h-[6px] sm:h-[8px] w-[6px] sm:w-[8px] bg-[#F4A261]"></div>
                <div
                    className="absolute right-[-52px] sm:right-[-67px] top-0 h-[95px] sm:h-[122px] w-[98px] sm:w-[128px]"
                    style={{
                        backgroundImage: "url('/RightEllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                    }}
                />
                <div className="absolute right-0 bottom-0 h-[6px] sm:h-[8px] w-[6px] sm:w-[8px] bg-[#E9C46A]"></div>
            </div>

            <div className="w-full h-[40px] sm:h-[50px] flex bg-[#E76F51] rounded-b-[30px] overflow-hidden">
                <div className="w-1/2 flex items-center justify-center border-r-2 border-white">
                    <img
                        src={imageUrl || "/userImage.png"}
                        alt="Profile"
                        className="w-[28px] h-[28px] sm:w-[35px] sm:h-[35px] rounded-full object-cover"
                    />
                </div>
                <div
                    className="w-1/2 flex flex-col items-center justify-center text-white text-xs sm:text-sm px-2 text-center"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                    <p className="flex flex-wrap">{name || "User"}</p>
                </div>
            </div>
        </div>
        {showRequest && (
            <SwapRequest
                userId={userId}
                userName={name}
                imageUrl={imageUrl}
                availability={availability}
                skillsTheyOffer={skillsTheyOffer}
                skillsTheyWant={skillsTheyWant}
                onClose={() => setShowRequest(false)}
            />
        )}
    </div>
);

// ...existing code...
};