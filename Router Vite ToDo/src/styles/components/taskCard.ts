import styled, { css } from "styled-components";

export const CardContainer = styled.div<{ $isCompleted?: boolean }>`
  background-color: var(--bg, #0f172a);
  border: 1px solid var(--border, #334155);
  border-radius: 14px;
  padding: 1.15rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: ${({ $isCompleted }) => ($isCompleted ? 0.85 : 1)};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: rgba(66, 133, 244, 0.4);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--google-green, #34a853);
`;

export const CardTitle = styled.h3<{ $isCompleted?: boolean }>`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-h, #f8fafc);
  flex-grow: 1;
  cursor: pointer;
  text-decoration: ${({ $isCompleted }) => ($isCompleted ? "line-through" : "none")};
  transition: color 0.2s ease;

  &:hover {
    color: #4285f4;
  }
`;

const statusStyles = {
  active: css`
    background: rgba(66, 133, 244, 0.15);
    color: #4285f4;
    border: 1px solid rgba(66, 133, 244, 0.3);
  `,
  pending: css`
    background: rgba(251, 188, 5, 0.18);
    color: #eab308;
    border: 1px solid rgba(251, 188, 5, 0.35);
  `,
  completed: css`
    background: rgba(52, 168, 83, 0.15);
    color: #34a853;
    border: 1px solid rgba(52, 168, 83, 0.3);
  `,
  cancelled: css`
    background: rgba(234, 67, 53, 0.15);
    color: #ea4335;
    border: 1px solid rgba(234, 67, 53, 0.3);
  `,
};

export const StatusBadge = styled.span<{ $status: string }>`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  ${({ $status }) =>
    statusStyles[$status as keyof typeof statusStyles] || statusStyles.active}
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--text, #94a3b8);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border, #334155);
  margin-top: 0.25rem;
`;

export const DateText = styled.span`
  font-size: 0.775rem;
  color: var(--text, #94a3b8);
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;
