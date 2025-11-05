"use client";
import { notFound } from "next/navigation";
import { getUser } from "@/app/actions/users/users";
import { useState, useEffect } from "react";
import UserInfo from "@/components/users/userInfo";
import { Spinner } from "flowbite-react";

interface Props {
  params: {
    id: string;
  };
}

export default function UsersDetails({ params }: Props) {
  const [user, setUser] = useState();
  const [isFound, setIsFound] = useState(true);
  const [loading, setLoading] = useState(true);

  if (!isFound) {
    notFound();
  }

  useEffect(() => {
    (async () => {
      const id = (await params).id;
      const response = await getUser(id);
      if (response.statusCode == 404 || response.statusCode == 500) {
        setIsFound(false);
        return;
      }
      setUser(response);
      setLoading(false);
    })();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <UserInfo user={user} />
    </div>
  );
}
