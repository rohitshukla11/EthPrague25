// app/ui/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Page() {
    const [circular, setCircular] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agent, setAgent] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [userPersona, setUserPersona] = useState("");
    const [result, setResult] = useState("");
    // For circular layout: calculate positions
    const radius = 250; // radius of the circle (increased for gap)
    const center = { x: 160, y: 160 };
    const circleCount = 5;
    const circleSize = 80;

    const agentZero = "Master Agent distributing tasks to sub-agents ..."
    const agentOne = "Historian Agent gathering data ..."
    const agentTwo = "Tour Guide Agent finding tourist destinations ..."
    const agentThree = "Translator Agent translating data to user language ..."
    const agentFour = "Itinerary Planner Agent generating itinerary ..."

    const displayText = [agentZero, agentOne, agentTwo, agentThree, agentFour]

    const agentOneImage = "/agents/one.png"
    const agentTwoImage = "/agents/two.png"
    const agentThreeImage = "/agents/three.png"
    const agentFourImage = "/agents/four.png"
    const agentZeroImage = "/agents/four.png"

    const displayImage = [agentZeroImage, agentOneImage, agentTwoImage, agentThreeImage, agentFourImage, agentZeroImage]

    useEffect(() => {
        fetch('https://gateway.lighthouse.storage/ipfs/bafkreihnww7qeiztt2qh5se5raqkrgg54gs7gypn7w73etphqr3rsmquvm')
            .then(res => res.json())
            .then(data => setUserPersona(data))
            .catch(console.error);
    }, []);

    const handleAgentCall = async (userInput: string) => {
        setAgent(0);
        console.log(agent)
        setCircular(true)

        try {
            // Call Agent One
            setAgent(1);
            console.log(userInput)
            const masterresponse = await fetch('/api/master', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userInput }),
            });

            if (!masterresponse.ok) {
                throw new Error('Failed to fetch Agent 1 data');
            }

            const masterData = await masterresponse.json();
            const parsedData = masterData.itinerary;
            console.log('Master response:', masterData.itinerary);


            // Call Agent Two
            setAgent(2);

            const response = await fetch('/api/historian', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: `Generate detailed history for Prague City` }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Agent 2 data');
            }

            const historydata = await response.json();
            console.log('Historian response:', historydata);

            // Call Agent Three
            setAgent(3);

            const agentTwoResponse = await fetch('/api/tour-guide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: `Generate the content for Prague Tourist Guideance based on the user persona specified here ${userPersona}` }),
            });

            if (!agentTwoResponse.ok) {
                throw new Error('Failed to fetch Agent 3 data');
            }

            const dataAgentTwo = await agentTwoResponse.json();
            console.log('Historian response:', dataAgentTwo);

            // Call Agent Four
            setAgent(4);

            const agentThreeResponse = await fetch('/api/itinerary-planner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: `Generate personalized itinerary for Prague 3 days as per the user persona - ${userPersona} and include details for each place based on the historical data - ${historydata} and tourist guide data - ${dataAgentTwo} return the result to user` }),
            });

            if (!agentThreeResponse.ok) {
                throw new Error('Failed to fetch Agent 4 data');
            }

            const dataAgentThree = await agentThreeResponse.json();
            console.log('Itineary response:', dataAgentThree);

            // Call Agent Five
            setAgent(5);

            // const agentFourResponse = await fetch('/api/language-translator', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ query: `Read the Iterenary provided here - ${dataAgentThree.itinerary} return the result in the English` }),
            // });

            // if (!agentThreeResponse.ok) {
            //     throw new Error('Failed to fetch Agent 5 data');
            // }

            // const dataAgentFour = await agentFourResponse.json();
            // console.log('Final response:', dataAgentFour);
            setResult(dataAgentThree.itinerary);

            setLoading(true)
        } catch (error) {
            console.error('Error fetching agents data:', error);
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
                            <div style={{ 
                                whiteSpace: 'pre-wrap',
                                fontFamily: "'Press Start 2P', 'Share Tech Mono', monospace",
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: '#e6ccb2',
                                background: 'rgba(26,18,7,0.92)',
                                padding: '2rem',
                                borderRadius: '12px',
                                boxShadow: '8px 8px 0 #5c4326',
                                maxHeight: '70vh',
                                overflowY: 'auto',
                                border: '4px solid #996515',
                                backgroundImage: "linear-gradient(45deg, #2d1a07 25%, transparent 25%, transparent 75%, #2d1a07 75%), linear-gradient(45deg, #2d1a07 25%, transparent 25%, transparent 75%, #2d1a07 75%)",
                                backgroundSize: "16px 16px",
                                backgroundPosition: "0 0, 8px 8px",
                            }}>
                                {result.split('**').map((part, index) => {
                                    if (index % 2 === 1) {
                                        return <strong key={index} style={{ 
                                            color: '#996515',
                                            textShadow: '2px 2px 0 #5c4326'
                                        }}>{part}</strong>;
                                    }
                                    return part;
                                }).map((part, index) => {
                                    const text = typeof part === 'string' ? part : '';
                                    if (text.includes('###')) {
                                        return <h2 key={index} style={{ 
                                            color: '#996515', 
                                            fontSize: '18px', 
                                            marginTop: '1.5rem',
                                            marginBottom: '1rem',
                                            textShadow: '2px 2px 0 #5c4326',
                                            borderBottom: '2px solid #996515',
                                            paddingBottom: '0.5rem'
                                        }}>{text.replace('###', '')}</h2>;
                                    }
                                    if (text.includes('*Travel Tip:*')) {
                                        return <p key={index} style={{ 
                                            color: '#bfa76a',
                                            fontStyle: 'italic',
                                            marginTop: '0.5rem',
                                            marginBottom: '1rem',
                                            padding: '0.5rem',
                                            borderLeft: '4px solid #996515',
                                            background: 'rgba(153, 101, 21, 0.1)'
                                        }}>{text}</p>;
                                    }
                                    return <p key={index} style={{ 
                                        marginBottom: '0.5rem',
                                        textShadow: '1px 1px 0 #5c4326'
                                    }}>{text}</p>;
                                })}
                            </div>
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
                                        onChange={(e) => setUserInput(e.target.value)}
                                        value={userInput}
                                        placeholder="Where to visit ..."
                                        name="text"
                                        type="text"
                                    />
                                    <button
                                        onClick={() => handleAgentCall(userInput)}
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
                            {displayText[agent - 1]}
                        </div>
                    )}
                </>}
            </>

        </div>
    );
}

