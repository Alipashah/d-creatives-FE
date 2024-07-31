export const handleUnauth = () => {
  // localStorage.removeItem("id");
  // localStorage.removeItem("name");
  // localStorage.removeItem("image");
  // localStorage.removeItem("email");
  // localStorage.removeItem("role");
  // localStorage.removeItem("token");
  // localStorage.removeItem("projectList");
  localStorage.clear();

  window.location.reload(false);
};
