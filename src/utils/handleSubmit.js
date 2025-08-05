import api from "../utils/axios"; // make sure this path is correct

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await api.post("/users/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      whatsappNo: formData.mobile,
      state: formData.state,
      district: formData.district,
      // taluka: formData.taluka,
      course: formData.course,
    });

    localStorage.setItem("userId", res.data.userId);
    window.location.href = "/verify-otp";
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};
