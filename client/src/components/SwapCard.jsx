import React, { useState, useEffect, useId } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { requestAnimation, releaseAnimation, cancelAnimation } from '../store/lockSlice';
import SwapRequest from './SwapRequest';

export const SwapCard = ({ userId, name, imageUrl, skillsTheyOffer = [], skillsTheyWant = [], availability = [] }) => {
    const cardId = useId(); // Generate unique ID for this card instance
    const dispatch = useDispatch();
    const activeCardId = useSelector(state => state.animation.activeCardId);
    const isAnimating = activeCardId === cardId;
    
    const [offerIndex, setOfferIndex] = useState(0);
    const [wantIndex, setWantIndex] = useState(0);
    const [showRequest, setShowRequest] = useState(false);
    
    // Check if this card should animate
    const shouldAnimate = (skillsTheyOffer.length > 1 || skillsTheyWant.length > 1);
    
    useEffect(() => {
        if (!shouldAnimate) return;
        
        // Request animation permission
        dispatch(requestAnimation({ cardId }));
        
        // Cleanup on unmount
        return () => {
            dispatch(cancelAnimation({ cardId }));
        };
    }, [cardId, shouldAnimate, dispatch]);
    
    useEffect(() => {
        if (!isAnimating || !shouldAnimate) return;
        
        let offerInterval, wantInterval;
        
        // Start intervals only when this card is active
        if (skillsTheyOffer.length > 1) {
            offerInterval = setInterval(() => {
                setOfferIndex(prev => (prev + 1) % skillsTheyOffer.length);
            }, 2000);
        }
        
        if (skillsTheyWant.length > 1) {
            wantInterval = setInterval(() => {
                setWantIndex(prev => (prev + 1) % skillsTheyWant.length);
            }, 3000);
        }
        
        // Auto-release animation after reasonable time (e.g., 30 seconds)
        const autoReleaseTimer = setTimeout(() => {
            dispatch(releaseAnimation({ cardId }));
        }, 30000);
        
        return () => {
            clearInterval(offerInterval);
            clearInterval(wantInterval);
            clearTimeout(autoReleaseTimer);
        };
    }, [isAnimating, shouldAnimate, skillsTheyOffer.length, skillsTheyWant.length, cardId, dispatch]);
    
    // Release animation when card becomes inactive (e.g., user scrolls away)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isAnimating) {
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

    return (
        <div onClick={() => setShowRequest(true)}>
            <div className="w-[179px] h-[173px] relative bg-transparent">
                <div className="w-full h-[122px] rounded-t-[17px] bg-[#E76F51] border-b-2 border-white relative overflow-hidden flex items-center justify-center">
                    <img
                        src="/Arrows.svg"
                        alt="Swap Taf"
                        className="w-[32px] h-[15px] scale-[1.5]"
                    />

                    {/* Left: Skills They Offer */}
                    <div className="absolute left-1 top-3 z-50 w-[31px] h-[100px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={skillsTheyOffer?.[offerIndex]?.name}
                                initial={{ x: -70, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 70, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center z-50 transform rotate-90 origin-center text-[min(0.9rem,100%)] text-[#264653] leading-3 font-bold"
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                            >
                                {getNameBeforeBracket(skillsTheyOffer?.[offerIndex]?.name) || ""}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    {/* Right: Skills They Want */}
                    <div className="absolute right-1 top-3 z-50 w-[32px] h-[100px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={skillsTheyWant?.[wantIndex]?.name}
                                initial={{ x: -70, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 70, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center z-50 transform -rotate-90 origin-center text-[min(0.9rem,100%)] text-[#264653] leading-3 font-bold"
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                            >
                                {getNameBeforeBracket(skillsTheyWant?.[wantIndex]?.name) || ""}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    {/* Decorations (unchanged) */}
                    <div
                        className="absolute left-[-67px] top-0 h-[122px] w-[126px] flex items-end"
                        style={{
                            backgroundImage: "url('/LeftEllipse.svg')",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                        }}
                    />
                    <div className="absolute left-0 bottom-0 h-[8px] w-[8px] bg-[#F4A261]"></div>
                    <div
                        className="absolute right-[-67px] top-0 h-[122px] w-[126px]"
                        style={{
                            backgroundImage: "url('/RightEllipse.svg')",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                        }}
                    />
                    <div className="absolute right-0 bottom-0 h-[8px] w-[8px] bg-[#E9C46A]"></div>
                </div>

                <div className="w-full h-[50px] flex bg-[#E76F51] rounded-b-[30px] overflow-hidden">
                    {/* Left: Image */}
                    <div className="w-1/2 flex items-center justify-center border-r-2 border-white">
                        <img
                            src={imageUrl || "/userImage.png"}
                            alt="Profile"
                            className="w-[35px] h-[35px] rounded-full object-cover"
                        />
                    </div>
                    {/* Right: Name */}
                    <div
                        className="w-1/2 flex flex-col items-center justify-center text-white text-sm px-2 text-center"
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
};