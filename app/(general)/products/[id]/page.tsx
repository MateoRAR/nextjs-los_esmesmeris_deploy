import { getProduct } from "@/app/actions/products";
import ProductForm from "@/components/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div className="p-6">
      <ProductForm product={product} />
    </div>
  );
}

