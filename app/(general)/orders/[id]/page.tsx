import { getOrder } from "@/app/actions/orders";
import OrderForm from "@/components/orders/OrderForm";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <div className="p-6">
      <OrderForm order={order} />
    </div>
  );
}

