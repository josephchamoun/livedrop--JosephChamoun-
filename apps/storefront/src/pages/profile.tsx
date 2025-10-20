/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../components/templates/MainLayout";
import { getCustomerById } from "../lib/api"; // ✅ This already points to Render
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
  LogOut,
} from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("No logged-in user found");
          setLoading(false);
          // Redirect to login after 2 seconds
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user._id) {
          setError("Invalid user data");
          setLoading(false);
          return;
        }

        // ✅ Fetch fresh customer data from API using helper function
        const data = await getCustomerById(user._id);
        setCustomer(data);
      } catch (err: any) {
        console.error("Error fetching customer:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerEmail");
    navigate("/login");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              Loading your profile...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!customer) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-8 max-w-md text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold">
              No customer data
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">My Profile</h1>
                <p className="text-blue-100">Manage your account information</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
          {/* Main Info Section */}
          <div className="p-8 space-y-6">
            {/* Name */}
            <div className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {customer.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {customer.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Phone Number
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {customer.phone || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Address
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {customer.address || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Joined Date */}
            <div className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Member Since
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {new Date(customer.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Account ID:{" "}
                <span className="font-mono font-semibold text-gray-800">
                  {customer._id}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
