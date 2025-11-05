import { getDisposals } from "@/app/actions/disposals";
import DisposalTable from "@/components/disposals/DisposalTable";
import Link from "next/link";

export default async function DisposalsPage() {
  const disposals = await getDisposals();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Disposiciones</h1>
        <Link
          href="/disposals/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Nuevo
        </Link>
      </div>
      <DisposalTable disposals={disposals} />
    </div>
  );
}


