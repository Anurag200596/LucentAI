import React, { useState, useRef } from "react";
import { createContext } from "react";
import main from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const queryIdRef = useRef(0);

  const [input, setInput] = useState("");
  const [recent, setRecent] = useState("");
  const [previous, setPrevious] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const onSent = async (prompt) => {
    
    const thisQueryId = ++queryIdRef.current;

    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;
    const query = prompt !== undefined ? prompt : input;

    if (prompt !== undefined) {
      response = await main(prompt);
      setRecent(prompt);
    } else {
      response = await main(input);
      setRecent(input);
      if (input.trim() !== "" && !previous.includes(input)) {
        setPrevious((prev) => [...prev, input]);
      }
    }

    if (!response) {
      setLoading(false);
      return;
    }

    const newResponse = response.replace(
      /\*\*(.*?)\*\*/g,
      "<strong style='font-weight: bold; color: white;'>$1</strong>"
    );
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");

   
    newResponseArray.forEach((word, i) => {
      setTimeout(() => {
        if (queryIdRef.current === thisQueryId) {
          setResultData((prev) => prev + word + " ");
        }
      }, 75 * i);
    });

    setLoading(false);
  };

  const contextValue = {
    previous,
    setPrevious,
    onSent,
    recent,
    setRecent,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    setShowResult,
    setLoading
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
