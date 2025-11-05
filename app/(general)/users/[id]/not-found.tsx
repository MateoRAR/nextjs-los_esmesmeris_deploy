import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <p>Sorry, this user doesn't exist. It may have been deleted. </p>
      <a className="mt-4 p-2 bg-gray-900 text-white rounded hover:bg-gray-600 transition-all" href="/users">
      Return to users 
      </a>

    </div>
  );
}
