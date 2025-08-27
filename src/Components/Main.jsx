import React, { useContext, useEffect, useState } from "react"
import { assets } from "../assets/assets"
import { Context } from "../Context/context"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Main = () => {
    const { onSent, recent, setRecent, showResult, loading, resultData, input, setInput } = useContext(Context);

    let { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition()
    const [listening, setListening] = useState(false)

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    // const listeningHandler = () => {
    //     resetTranscript()
    //     listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
    //     setListening(prev => !prev)
    // }
    
    const listeningHandler = async () => {
        resetTranscript();
        try {
          if (!listening) {
            await SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
          } else {
            SpeechRecognition.stopListening();
          }
          setListening(prev => !prev);
        } catch (error) {
          console.error("Speech recognition error:", error);
          alert("Microphone access failed. Please allow microphone permissions.");
        }
      }

    const loadPrompt2 = async (prompt) => {
        console.log(prompt)
        setRecent(prompt)
        await onSent(prompt)
    }
    const clickHandler = () => {
        onSent();
        setInput("");
    };

    useEffect(() => {
        if (listening && transcript) {
            setInput(transcript)
        }

    }, [transcript])


    return (
        <div className="main overflow-hidden flex-1 min-h-screen pb-[16vh] relative bg-black">
            <div className="nav flex flex-wrap items-center justify-between text-[16px] sm:text-[18px] md:text-[26px] p-3 sm:p-4 md:p-6 text-[#585858]">
                <p className="w-full sm:w-auto mb-2 sm:mb-0">Lucent AI</p>
                <img className="w-[36px] sm:w-[40px] md:w-[50px] rounded-full" src={assets.user_icon} alt="" />
            </div>

            <div className="main-container max-w-[900px] w-full px-3 sm:px-4 md:px-6 m-auto">
                {!showResult ? (
                    <>
                        <div className="greet text-[26px] sm:text-[32px] md:text-[56px] font-semibold py-2 sm:py-3 md:py-[15px] text-[#c4c7c5]">
                            <p><span>Hello, Dev.</span></p>
                            <p>How can I help you today?</p>
                        </div>

                        <div className="cards grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {[
                                {
                                    text: "Suggest beautiful places to see on an upcoming roadtrip",
                                    icon: assets.compass_icon
                                },
                                {
                                    text: "Briefly summarize this concept : urban planning",
                                    icon: assets.bulb_icon
                                },
                                {
                                    text: "Brainstorm team bonding activities for our work retreat",
                                    icon: assets.message_icon
                                },
                                {
                                    text: "Improve the readability of the following code",
                                    icon: assets.code_icon
                                }
                            ].map((card, index) => (
                                <div onClick={() => loadPrompt2(card.text)} key={index} className="bg-white/5 backdrop-blur-md border border-white/10 text-white transition duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(192,192,192,0.4)] h-[160px] sm:h-[180px] md:h-[200px] p-3 sm:p-4 relative cursor-pointer rounded-md">
                                    <p className="text-[13px] sm:text-[15px] md:text-[17px] text-[#a0a0a0]">{card.text}</p>
                                    <img className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 absolute right-2 bottom-2 bg-zinc-400 rounded-full p-1" src={card.icon} alt="" />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="result py-3 sm:py-4 px-3 sm:px-4 md:px-5 flex flex-col max-h-[70vh] w-full gap-4 sm:gap-5 mt-2 overflow-y-auto">
                        <div className="result-title flex flex-wrap sm:flex-nowrap items-center w-full gap-3 sm:gap-4 capitalize">
                            <img className="w-8 sm:w-9 md:w-10 rounded-full" src={assets.user_icon} alt="" />
                            <p className="text-sm sm:text-base md:text-lg font-medium">{recent}</p>
                        </div>

                        <div className="result-data flex gap-3 sm:gap-4 w-full text-white items-start">
                            <img className="w-8 sm:w-9 md:w-10" src={assets.gemini_icon} alt="" />
                            {
                                loading ? (
                                    <div className="loader w-full flex flex-col gap-2 sm:gap-3">
                                        <hr className="rounded-md border-none border-2 border-[#f6f7f8]" />
                                        <hr className="rounded-md border-none border-2 border-[#f6f7f8]" />
                                        <hr className="rounded-md border-none border-2 border-[#f6f7f8]" />
                                    </div>
                                ) : (
                                    <p className="text-xs sm:text-sm md:text-base" dangerouslySetInnerHTML={{ __html: resultData }}></p>
                                )
                            }
                        </div>
                    </div>
                )}

                <div className="main-bottom absolute bottom-2 w-full max-w-[900px] px-2 sm:px-3 md:px-6">
                    <div className="search_box flex flex-wrap items-center justify-between bg-transparent border border-zinc-100 text-white gap-2 sm:gap-3 md:gap-5 rounded-full py-2 sm:py-[10px] md:py-[15px] px-3 md:px-[20px]">
                        <input
                        onKeyDown={(e)=> e.key === "Enter" && clickHandler()}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 min-w-[150px] border-0 outline-0 text-sm sm:text-base md:text-lg text-white font-medium bg-transparent"
                            type="text"
                            placeholder="Enter a prompt here"
                        />
                        <div className="flex gap-2 sm:gap-3 items-center">
                            <img className="w-4 sm:w-5 cursor-pointer invert" src={assets.gallery_icon} alt="gallery" />
                            <img
                                onClick={listeningHandler}
                                className={`w-4 sm:w-5 cursor-pointer invert transition duration-300 ${listening ? "animate-pulse bg-green-500 rounded-full p-1" : ""
                                    }`}
                                src={assets.mic_icon}
                                alt="mic"
                            />
                            <img
                                onClick={clickHandler}
                                className="w-4 sm:w-5 cursor-pointer invert"
                                src={assets.send_icon}
                                alt="send"
                            />
                        </div>
                    </div>

                    <p className="text-[10px] sm:text-xs md:text-sm mt-2 md:mt-3 text-[#6A5858] text-center md:text-left leading-snug">
                        Lucent AI may display inaccurate info, including about people, so double check its responses. Your privacy and Lucent AI Apps
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
