import { BrandWrapper, BunsenplusText, SpinningBrandIcon, type LogoSize } from "../styles/components/logo";

type BunsenplusLogoProps = {
    size?: LogoSize;
};

export const BunsenplusLogo = ({ size = "md" }: BunsenplusLogoProps) => {
    return (
        <BrandWrapper $size={size}>
            <SpinningBrandIcon $size={size} title="Active Spinner" />
            <BunsenplusText $size={size}>
                <span>B</span><span>u</span><span>n</span><span>s</span><span>e</span><span>n</span><span>p</span><span>l</span><span>u</span><span>s</span>
            </BunsenplusText>
        </BrandWrapper>
    );
}     
