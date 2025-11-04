import { getSupplier } from "@/app/actions/suppliers";
import SupplierForm from "@/components/suppliers/SupplierForm";

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await getSupplier(id);

  return (
    <div className="p-6">
      <SupplierForm supplier={supplier} />
    </div>
  );
}
