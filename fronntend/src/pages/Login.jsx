import React, { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contact_no: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    let tempErrors = {};
   
    if (!formData.firstName.trim()) tempErrors.name = "Name is required";
    if (!formData.middleName.trim()) tempErrors.name = "Name is required";
    if (!formData.lastName.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    if (!formData.password.trim()) tempErrors.password = "Password is required";
    if (!formData.contact_no.trim()) {
        tempErrors.contact_no = "Contact number is required";
    } else if (formData.contact_no.length < 10) {
        tempErrors.contact_no = "Contact number must be at least 10 digits";
    }

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      alert("Form submitted successfully!");
      console.log("Form Data:", formData);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-5">
            {/* first Name */}
            <div>
            <label>First Name</label>
            <input
                type="text"
                name="firstName"
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.firstName}
                onChange={handleChange}  
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>

            {/* middle Name */}
            <div>
                <label>Middle Name</label>
                <input 
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.middleName && <p className="text-red-500 text-sm">{errors.middleName}</p>}
            </div>

            {/* last Name */}
            <div>
                <label>Last Name</label>
                <input 
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2" 
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Contact no */}
        <div>
            <label>Contact</label>
            <input 
              type="number"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full border border-gray-300 rounded-md p-2 " 
             />
             {errors.contact_no  && <p className="text-red-500 text-sm">{errors.contact_no}</p>}
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
