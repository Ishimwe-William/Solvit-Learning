import styled from "styled-components";

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 480px) {
    gap: 0.65rem;
    margin-bottom: 1.25rem;
  }
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background-color: var(--code-bg, #0f172a);
  padding: 0.3rem;
  border-radius: 12px;
  border: 1px solid var(--border, #334155);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;

  /* Custom scrollbar for mobile overflow */
  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 0.2rem;
    gap: 0.25rem;
    width: 100%;
  }
`;

export const FilterButton = styled.button<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? "600" : "500")};
  color: ${({ $isActive }) => ($isActive ? "#ffffff" : "#94a3b8")};
  background: ${({ $isActive }) =>
    $isActive ? "linear-gradient(135deg, #4285f4, #2563eb)" : "transparent"};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  box-shadow: ${({ $isActive }) =>
    $isActive ? "0 2px 8px rgba(66, 133, 244, 0.3)" : "none"};

  @media (max-width: 480px) {
    padding: 0.35rem 0.65rem;
    font-size: 0.8rem;
    gap: 0.3rem;
  }

  &:hover {
    color: #ffffff;
    background: ${({ $isActive }) =>
      $isActive
        ? "linear-gradient(135deg, #4285f4, #2563eb)"
        : "rgba(255, 255, 255, 0.08)"};
  }

  &:focus-visible {
    outline: 2px solid #4285f4;
    outline-offset: 2px;
  }
`;

export const FilterBadge = styled.span<{ $isActive: boolean }>`
  font-size: 0.75rem;
  padding: 0.1rem 0.45rem;
  border-radius: 10px;
  font-weight: 600;
  background-color: ${({ $isActive }) =>
    $isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.12)"};
  color: ${({ $isActive }) => ($isActive ? "#ffffff" : "#cbd5e1")};

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.05rem 0.35rem;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 240px;
  flex: 1;
  max-width: 360px;

  @media (max-width: 640px) {
    max-width: 100%;
    width: 100%;
    min-width: 100%;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  display: flex;
  align-items: center;
  color: #94a3b8;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.55rem 2.25rem 0.55rem 2.25rem;
  border-radius: 10px;
  border: 1px solid var(--border, #334155);
  background-color: var(--bg, #1e293b);
  color: var(--text-h, #f8fafc);
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;

  @media (max-width: 480px) {
    padding: 0.45rem 2rem 0.45rem 2rem;
    font-size: 0.85rem;
  }

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #4285f4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.15);
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 0.6rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: 50%;
  transition: all 0.15s ease;

  &:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.1);
  }
`;
