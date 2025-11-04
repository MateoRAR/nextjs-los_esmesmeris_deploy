import { getDisposal } from "@/app/actions/disposals";
import DisposalForm from "@/components/disposals/DisposalForm";

export default async function EditDisposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const disposal = await getDisposal(id);

  return (
    <div className="p-6">
      <DisposalForm disposal={disposal} />
    </div>
  );
}


