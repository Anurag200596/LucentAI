import React, { useContext, useState } from "react"
import { assets } from "../assets/assets"
import { Context } from "../Context/context"

const Sidebar = () => {
    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)     
    }
    const loadPrompt1 = async(prompt)=>{
        console.log(prompt)
        setRecent(prompt)
        await onSent(prompt)
    }
  
    const [extended, setExtended] = useState(false)
    const { onSent, previous,setLoading, setRecent,setInput,setShowResult } = useContext(Context)
  
    return (
        <div className="sidebar  outfit p-5 flex text-white flex-col min-h-screen justify-between bg-zinc-900 ">
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} src={assets.menu_icon} alt="" className="menu block cursor-pointer" />
                <div onClick={newChat} className="new-chat flex cursor-pointer  items-center gap-4 mt-10 mr-2  py-2 px-3 text-gray-600 bg-zinc-700 rounded-full">
                    <img className="cursor-pointer" src={assets.plus_icon} alt="" />
                    {extended ? <p className="text-sm text-white transition-all duration-300 ">New Chat</p> : null}
                </div>
                {extended ? <div className="recent">
                    <p className="recent-title block mt-8 font-normal">Recent</p>
                    {
                        previous.map((elem, idx) => {return(
                            <div   key={idx} onClick={()=>loadPrompt1(elem)} className="recent-entry text-sm py-1 px-5 rounded-full hover:bg-zinc-800 cursor-pointer flex items-center gap-2 mt-1 ml-2 text-[#282828]">
                                <img className="cursor-pointer" src={assets.message_icon} alt="" />
                                <p className="capitalize text-white">{elem.slice(0,18)}...</p>
                            </div>
                        )}
                        
                        
                        )
                    }
                </div> : null}

            </div>
            <div className="bottom flex flex-col gap-4 text-sm">
                <div className="bottom-item recent-entry flex gap-2 items-center">
                    <img className="cursor-pointer" src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}

                </div>
                <div className="bottom-item recent-entry flex gap-2 items-center">
                    <img className="cursor-pointer" src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry flex gap-2 items-center">
                    <img className="cursor-pointer" src={assets.setting_icon} alt="" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
