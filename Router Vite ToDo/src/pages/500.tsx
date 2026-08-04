import { Button } from "../components/Button";
import {
  ActionGroup,
  ErrorCode,
  ExceptionContainer,
  ExceptionMessage,
  ExceptionTitle,
} from "../styles/pages/exceptions";
import { FaSync, FaHome } from "react-icons/fa";

export interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorPage = ({ error, resetErrorBoundary }: ErrorPageProps) => {
  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <ExceptionContainer>
      <ErrorCode>500</ErrorCode>
      <ExceptionTitle>Application Error Occurred</ExceptionTitle>
      <ExceptionMessage>
        {error?.message ||
          "Oops! A runtime or syntax exception occurred while processing your request. Don't worry, your data is safe."}
      </ExceptionMessage>

      <ActionGroup>
        <Button onClick={handleReload} variant="primary" size="md">
          <FaSync /> Try Again
        </Button>
        <Button to="/" variant="secondary" size="md">
          <FaHome /> Go Back Home
        </Button>
      </ActionGroup>
    </ExceptionContainer>
  );
};
