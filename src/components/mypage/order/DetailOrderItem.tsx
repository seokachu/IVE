import Image from "next/image";

interface DetailOrderItemProps {
  item: any;
}

const DetailOrderItem = ({ item }: DetailOrderItemProps) => {
  console.log("item", item);
  return (
    <li className="border rounded-lg p-4">
      <div className="relative flex gap-4 overflow-hidden rounded-md w-[80px] h-[80px]">
        {item.product_image && (
          <Image
            src={item.product_image}
            alt={item.product_name}
            className="object-cover border"
            width={500}
            height={500}
          />
        )}
        <div className="flex-1">
          <p className="font-medium">{item.product_name}</p>
          <p className="text-gray-600">수량: {item.quantity}개</p>
          <p className="font-bold mt-2">
            {(item.price * item.quantity).toLocaleString()}원
          </p>
        </div>
      </div>
    </li>
  );
};

export default DetailOrderItem;
