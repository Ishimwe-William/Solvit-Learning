import styled from "styled-components";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#ef4444" : "var(--border, #334155)")};
  background-color: var(--bg, #1e293b);
  color: var(--text-h, #f8fafc);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? "#ef4444" : "#4285f4")};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? "rgba(239, 68, 68, 0.2)" : "rgba(66, 133, 244, 0.15)")};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
`;

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  fullWidth = true,
  id,
  className,
  ...props
}) => {
  return (
    <InputContainer $fullWidth={fullWidth} className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} $hasError={Boolean(error)} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};