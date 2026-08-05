import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io"
export const Ratings = ({ rating }: { rating: number }) => {
    const fullStar = Math.floor(rating);
    const color: string = "yellow"
    
    if (rating > 5) rating = 5;

    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStar = Math.max(0, 5 - fullStar - halfStar);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: fullStar }).map((_, i) => (
                <IoMdStar key={`full-${i}`} color={color} />
            ))}

            {Array.from({ length: halfStar }).map((_, i) => (
                <IoMdStarHalf key={`half-${i}`} color={color} />
            ))}

            {Array.from({ length: emptyStar }).map((_, i) => (
                <IoMdStarOutline key={`empty-${i}`} color={color} />
            ))}
        </div>
    );
};