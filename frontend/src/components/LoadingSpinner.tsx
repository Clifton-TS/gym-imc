"use client";

import { useEffect, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Spinner size="xl" />
    </Box>
  );
};

export default LoadingSpinner;
