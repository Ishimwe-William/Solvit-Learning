import styled, { keyframes } from "styled-components";

// Floating animation for error graphics or text
const float = keyframes`
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    `;

// Main full-page wrapper for exception views
export const ExceptionContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 65vh;
      padding: 2rem;
      text-align: center;
    `;

// Stylized gradient error code (e.g. 404) with floating effect
export const ErrorCode = styled.h1`
      font-size: 7.5rem;
      font-weight: 900;
      margin: 0;
      line-height: 1;
      letter-spacing: -3px;
      background: linear-gradient(135deg, #4285f4, #ea4335, #fbbc05, #34a853);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: ${float} 4s ease-in-out infinite;
    `;

// Exception Icon container (optional)
export const ExceptionIcon = styled.div`
      font-size: 4rem;
      color: #ea4335;
      margin-bottom: 1rem;
      animation: ${float} 3.5s ease-in-out infinite;
    `;

// Error heading title
export const ExceptionTitle = styled.h2`
      font-size: 2rem;
      font-weight: 700;
      margin: 1rem 0 0.5rem;
      color: inherit;
    `;

// Informative error message subtext
export const ExceptionMessage = styled.p`
      font-size: 1.05rem;
      color: #94a3b8;
      max-width: 480px;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    `;

// Action buttons container (e.g. Go Home, Retry)
export const ActionGroup = styled.div`
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    `;