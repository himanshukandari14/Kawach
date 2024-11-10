// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user); // Get the user from Redux state
  const token = useSelector((state) => state.auth.token); // Get the token from Redux state

  // Check if user and token are present
  return user && token ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;