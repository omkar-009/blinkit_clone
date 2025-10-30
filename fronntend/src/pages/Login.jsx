import React, { useState } from "react";
import api from "../../utils/api";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact_no: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form Submit with API Call
  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};

    // ✅ Validation
    if (!formData.username.trim()) tempErrors.username = "Name is required";
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Enter a valid email address";

    if (!formData.password.trim()) tempErrors.password = "Password is required";

    if (!formData.contact_no.trim()) {
      tempErrors.contact_no = "Contact number is required";
    } else if (!/^\d+$/.test(formData.contact_no)) {
      tempErrors.contact_no = "Contact number must be numeric";
    } else if (formData.contact_no.length < 10) {
      tempErrors.contact_no = "Contact number must be at least 10 digits";
    }

    setErrors(tempErrors);

    // Stop if any validation errors
    if (Object.keys(tempErrors).length > 0) return;

    try {
      setLoading(true);

      // Call backend API
      const response = await api.post("/user/register", formData);

      if (response.data.success) {
        alert("Registration successful!");

        // ✅ Reset form on success
        setFormData({
          username: "",
          email: "",
          contact_no: "",
          password: "",
        });

        setErrors({});
      } else {
        alert(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error?.response?.data?.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="username"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Contact No */}
        <div>
          <label className="block font-medium mb-1">Contact</label>
          <input
            type="text"
            name="contact_no"
            value={formData.contact_no}
            onChange={handleChange}
            placeholder="Enter your contact number"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.contact_no && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_no}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Passwordsss</label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-md transition font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
