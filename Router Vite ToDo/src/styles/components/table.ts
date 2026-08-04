import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background-color: var(--code-bg, #1e293b);
  border: 1px solid var(--border, #334155);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
`;

export const TableHead = styled.thead`
  background-color: var(--bg, #0f172a);
  border-bottom: 1px solid var(--border, #334155);

  th {
    padding: 0.85rem 1rem;
    font-weight: 700;
    font-size: 0.775rem;
    color: var(--text, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    @media (max-width: 640px) {
      padding: 0.7rem 0.6rem;
      font-size: 0.725rem;
    }
  }

  @media (max-width: 640px) {
    th.col-desc {
      display: none;
    }
  }

  @media (max-width: 480px) {
    th.col-created {
      display: none;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--border, #334155);
    transition: background-color 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(66, 133, 244, 0.05);
    }
  }

  td {
    padding: 0.85rem 1rem;
    color: var(--text-h, #f8fafc);
    vertical-align: middle;

    @media (max-width: 640px) {
      padding: 0.7rem 0.6rem;
    }
  }

  @media (max-width: 640px) {
    td.col-desc {
      display: none;
    }
  }

  @media (max-width: 480px) {
    td.col-created {
      display: none;
    }
  }
`;

export const TableRow = styled.tr<{ $isCompleted?: boolean }>`
  opacity: ${({ $isCompleted }) => ($isCompleted ? 0.75 : 1)};
`;

export const CheckboxCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--google-green, #34a853);
  }
`;

export const TableCellTitle = styled.div<{ $isCompleted?: boolean }>`
  font-weight: 600;
  font-size: 0.925rem;
  color: var(--text-h, #f8fafc);
  cursor: pointer;
  text-decoration: ${({ $isCompleted }) => ($isCompleted ? "line-through" : "none")};
  transition: color 0.2s ease;

  &:hover {
    color: #4285f4;
  }

  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`;

export const TableCellDesc = styled.div`
  font-size: 0.85rem;
  color: var(--text, #94a3b8);
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmptyTableState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text, #94a3b8);
  font-size: 0.95rem;
  font-style: italic;
`;

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;
