import { Button } from "../components/Button";
import {
    ActionGroup,
    ErrorCode,
    ExceptionContainer,
    ExceptionMessage,
    ExceptionTitle,
} from "../styles/pages/exceptions";

export const PageNotFound = () => {
    return (
        <ExceptionContainer>
            <ErrorCode>404</ErrorCode>
            <ExceptionTitle>Page Not Found</ExceptionTitle>
            <ExceptionMessage>
                Oops! The page you are looking for doesn't exist, has been removed, or has a broken link.
            </ExceptionMessage>

            <ActionGroup>
                <Button to="/" variant="primary" size="lg">
                    Go Back Home
                </Button>
            </ActionGroup>
        </ExceptionContainer>
    );
};