// app/ui/page.tsx

"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function Page() {
    const [circular, setCircular] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agent, setAgent] = useState(0);

    // For circular layout: calculate positions
    const radius = 250; // radius of the circle (increased for gap)
    const center = { x: 160, y: 160 };
    const circleCount = 5;
    const circleSize = 80;

    const agentOne = "Historian Agent gathering data ..."
    const agentTwo = "Tour Guide Agent finding tourist destinations ..."
    const agentThree = "Translator Agent translating data to user language ..."
    const agentFour = "Itinerary Planner Agent generating itinerary ..."

    const displayText = [agentOne, agentTwo, agentThree, agentFour]

    const agentOneImage = "/agents/one.png"
    const agentTwoImage = "/agents/two.png"
    const agentThreeImage = "/agents/three.png"
    const agentFourImage = "/agents/four.png"
    const agentFiveImage = "/agents/four.png"

    const displayImage = [agentOneImage, agentTwoImage, agentThreeImage, agentFourImage, agentFiveImage]

    const handleAgentCall = async () => {
        
        setCircular(true)

        try {
            // Call Agent One
            setAgent(1);
            console.log('Calling Agent One...');

            const response = await fetch('/api/historian', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch historical information');
            }

            const data = await response.json();
            console.log('Historian response:', data);

            // Call Agent Two
            setAgent(2);
            console.log('Calling Agent Two...');

            const agentTwoResponse = await fetch('/api/tour-guide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
            });

            if (!agentTwoResponse.ok) {
                throw new Error('Failed to fetch historical information');
            }

            const dataAgentTwo = await agentTwoResponse.json();
            console.log('Historian response:', dataAgentTwo);

            // Call Agent Three
            setAgent(3);
            console.log('Calling Agent Three...');
            const agentThreeResponse = await fetch('/api/language-translator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
            });

            if (!agentThreeResponse.ok) {
                throw new Error('Failed to fetch historical information');
            }

            const dataAgentThree = await agentThreeResponse.json();
            console.log('Historian response:', dataAgentThree);

            // Call Agent Four
            setAgent(4);
            console.log('Calling Agent Four...');
            const agentFourResponse = await fetch('/api/itinerary-planner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
            });

            if (!agentThreeResponse.ok) {
                throw new Error('Failed to fetch historical information');
            }

            const dataAgentFour = await agentFourResponse.json();
            console.log('Historian response:', dataAgentFour);
            setLoading(true)
        } catch (error) {
            console.error('Error fetching historian data:', error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingRight: '12vw',
            marginRight: '64px',
            overflowX: 'hidden',
            backgroundImage: 'url("/background.jpg")', // Replace with your actual image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>

            <>
                {loading ? (
                    <div>
                        <div
                            style={{
                                maxWidth: '600px',
                                color: '#fff8e1',
                                fontFamily: "'Press Start 2P', 'Share Tech Mono', monospace",
                                fontSize: '16px',
                                letterSpacing: '1px',
                                lineHeight: '2',
                                textAlign: 'right',
                                background: 'rgba(26,18,7,0.92)',
                                padding: '2rem',
                                borderRadius: '12px',
                                boxShadow: '8px 8px 0 #5c4326',
                                maxHeight: '70vh',
                                overflowY: 'auto',
                            }}
                        >
                            <h1 style={{ fontSize: '22px', marginBottom: '2rem', color: '#996515', textAlign: 'right' }}>Here's your iternary</h1>
                            <p>
                                Welcome to the Pixel Castle!<br /><br />
                                Here you will find a world of adventure, mystery, and pixelated wonders. As you wait, imagine the grand halls, the echo of footsteps on stone, and the glimmer of torches lighting the way.<br /><br />
                                The castle is full of secrets, hidden rooms, and treasures waiting to be discovered. Prepare yourself for a journey through time, where every brick tells a story and every shadow hides a legend.<br /><br />
                                Thank you for your patience. Your adventure will begin soon!
                            </p>
                        </div>
                    </div>
                ) : <>
                    {!circular ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '12px' }}>

                                {/* PIXEL THEME INPUT BOX & BUTTON */}
                                <div
                                    className="bottom-10 right-10 fixed w-[400px] border-4 border-[#996515] bg-[#1a1207] shadow-[8px_8px_0_#5c4326] flex"
                                    style={{
                                        fontFamily: "'Press Start 2P', 'Share Tech Mono', monospace",
                                        backgroundImage:
                                            "linear-gradient(45deg, #2d1a07 25%, transparent 25%, transparent 75%, #2d1a07 75%), linear-gradient(45deg, #2d1a07 25%, transparent 25%, transparent 75%, #2d1a07 75%)",
                                        backgroundSize: "16px 16px",
                                        backgroundPosition: "0 0, 8px 8px",
                                    }}
                                >
                                    <input
                                        className="bg-transparent outline-none border-none px-4 py-4 w-full text-[#e6ccb2] placeholder-[#bfa76a] text-base"
                                        style={{
                                            fontFamily: "'Press Start 2P', 'Share Tech Mono', monospace",
                                            letterSpacing: "1px",
                                            fontSize: "16px",
                                            borderRight: "4px solid #996515",
                                        }}
                                        placeholder="Where to visit ..."
                                        name="text"
                                        type="text"
                                    />
                                    <button
                                        onClick={handleAgentCall}
                                        className="h-full px-6 bg-[#996515] text-[#fff8e1] border-l-4 border-[#5c4326] font-bold"
                                        style={{
                                            fontFamily: "'Press Start 2P', 'Share Tech Mono', monospace",
                                            fontSize: "16px",
                                            boxShadow: "4px 4px 0 #5c4326",
                                            cursor: "pointer",
                                            transition: "background 0.2s",
                                        }}
                                    >
                                        GO
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ position: 'relative', width: 320, height: 320, marginTop: 40 }}>
                            {/* Ripple effect */}
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        left: center.x - 100 - i * 20,
                                        top: center.y - 100 - i * 20,
                                        width: 200 + i * 40,
                                        height: 200 + i * 40,
                                        borderRadius: '50%',
                                        border: '2px solid #8d5524',
                                        opacity: 0.12 + 0.08 * (4 - i),
                                        zIndex: 0,
                                        animation: 'ripple 2.5s linear infinite',
                                        animationDelay: `${i * 0.4}s`,
                                        pointerEvents: 'none',
                                        boxShadow: '0 0 32px 8px #a67c5233',
                                    }}
                                />
                            ))}
                            {/* Central big circle */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: center.x - 100,
                                    top: center.y - 100,
                                    width: 200,
                                    height: 200,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #a67c52 60%, #e6ccb2 100%)',
                                    border: '3px solid #8d5524',
                                    boxShadow: '0 0 48px 8px #a67c5277, 0 0 0 4px #a67c52',
                                    zIndex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image src={displayImage[agent]} className="rounded-full" alt="Agent" width={200} height={20} />
                            </div>
                            {/* 5 small circles */}
                            {[...Array(circleCount)].map((_, i) => {
                                // Distribute over semicircle: -90deg to +90deg
                                const angle = (-Math.PI / 2) + (i * Math.PI / (circleCount - 1));
                                const x = center.x + radius * Math.cos(angle) - circleSize / 2;
                                const y = center.y + radius * Math.sin(angle) - circleSize / 2;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            left: x,
                                            top: y,
                                            width: circleSize,
                                            height: circleSize,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #a67c52 60%, #e6ccb2 100%)',
                                            border: '2px solid #8d5524',
                                            boxShadow: '0 0 24px 4px #e6ccb255, 0 0 0 2px #a67c52',
                                            zIndex: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image src={displayImage[i]} className="rounded-full" alt="Agent" width={150} height={150} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {circular && (
                        <div
                            style={{
                                position: 'fixed',
                                top: '2vw',
                                left: '2vw',
                                zIndex: 50,
                                color: '#fff8e1',
                                fontFamily: "'Press Start 2P', 'Share Tech Mono', monospace",
                                fontSize: '16px',
                                letterSpacing: '1px',
                                textAlign: 'left',
                                minWidth: '320px',
                            }}
                        >
                            {displayText[agent]}
                        </div>
                    )}
                </>}
            </>

        </div>
    );
}

