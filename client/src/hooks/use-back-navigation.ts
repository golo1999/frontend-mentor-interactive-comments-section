import { useLocation, useNavigate } from "react-router-dom";

export function useBackNavigation() {
  const { key: locationKey } = useLocation();
  const navigate = useNavigate();

  function handleBackNavigation() {
    // If the history stack is empty (there is no previous route),
    // Redirecting to the "Home" page
    if (locationKey === "default") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }

  return handleBackNavigation;
}
