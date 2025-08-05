import api from "../utils/axios";

const token = localStorage.getItem("adminToken");

api.get("/admin/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(res => console.log(res.data))
  .catch(err => console.error("Failed to fetch admin users", err));
