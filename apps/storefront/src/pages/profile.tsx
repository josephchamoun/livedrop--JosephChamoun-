// /src/pages/profile.tsx
import { useEffect, useState } from "react";
import { MainLayout } from "../components/templates/MainLayout";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("No logged-in user found");
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const customerId = user._id;

    const fetchCustomer = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/customers/${customerId}`
        );
        if (!res.ok) throw new Error("Failed to fetch customer");
        const data = await res.json();
        setCustomer(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  if (loading)
    return (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    );
  if (error)
    return (
      <MainLayout>
        <p className="text-red-600">{error}</p>
      </MainLayout>
    );
  if (!customer)
    return (
      <MainLayout>
        <p>No customer data</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {customer.address || "N/A"}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(customer.createdAt).toLocaleDateString()}
        </p>
      </div>
    </MainLayout>
  );
}
