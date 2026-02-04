import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeleton = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => (
      <div
        className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-50 h-full"
        key={i}
      >
        <Skeleton height={240} borderRadius="1.8rem" />

        <div className="p-4">
          <Skeleton width={`90%`} height={20} borderRadius="0.5rem" />
          <Skeleton
            width={`40%`}
            height={15}
            className="mt-2"
            borderRadius="0.3rem"
          />

          <div className="flex justify-between items-center mt-6 pt-3 border-t border-gray-50">
            <Skeleton width={80} height={25} borderRadius="0.5rem" />
            <Skeleton width={40} height={40} borderRadius="1rem" />
          </div>
        </div>
      </div>
    ));
};

export default ProductSkeleton;
