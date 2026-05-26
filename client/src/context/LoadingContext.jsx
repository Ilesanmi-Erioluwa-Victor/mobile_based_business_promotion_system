import React, { useEffect, useState } from "react";
import loadingService from "../services/loadingService";
import LoadingModal from "../components/LoadingModal";

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = loadingService.subscribe((isLoading) =>
      setLoading(isLoading),
    );
    return () => unsub();
  }, []);

  return (
    <>
      {children}
      <LoadingModal open={loading} />
    </>
  );
};

export default LoadingProvider;
