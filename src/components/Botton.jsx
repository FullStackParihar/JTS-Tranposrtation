import React from "react";
import styled from "styled-components";

const Button = ({ text = "Button", onClick }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}>
        <span>{text}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  
  button {
    display: inline-block;
    width: 150px;
    height: 50px;
    border-radius: 10px;
   
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease-in;
    z-index: 1;
    cursor: pointer; /* Ensure it's clickable */
    background-color: #F57C00;
  }

  button::before,
  button::after { 
    content: ""; 
    position: absolute;
    top: 0;
    width: 0;
    height: 100%;
    transform: skew(15deg);
    transition: all 0.5s;
    overflow: hidden;
    z-index: -1;
  }

  button::before {
    left: -10px;
    background: #240046;
  }

  button::after {
    right: 0px;
    background: #F57C00;
  }

  button:hover::before,
  {
    width: 130%;
  }

  button:hover span {
    color: #e0aaff;
    transition: 0.3s;
  }

  button span {
    color: #03045e;
    font-size: 18px;
    transition: all 0.3s ease-in;
  }
`;

export default Button;
