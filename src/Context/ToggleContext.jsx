import React, { createContext, useState, useContext } from "react";

 
const ToggleContext = createContext();

 
export const ToggleProvider = ({ children }) => {
    const [toggle, setToggle] = useState(false);

    const toggleValue = () => {
        setToggle(prevToggle => !prevToggle);
    };

    return (
        <ToggleContext.Provider value={{ toggle, toggleValue }}>
            {children}
        </ToggleContext.Provider>
    );
};

 
export const useToggle = () => {
    const context = useContext(ToggleContext);
    if (!context) {
        throw new Error("useToggle must be used within a ToggleProvider");
    }
    return context;
};
