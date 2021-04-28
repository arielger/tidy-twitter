import React, { useState, createContext, useContext } from "react";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import Cookies from "js-cookie";

import { logOut } from "../utils/api";

const AuthContext = createContext<{
  value: {
    isAuthenticated: boolean;
  };
  actions: {
    handleLogIn: () => void;
    handleLogOut: () => void;
  };
}>({});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const [authState, setAuthState] = useState({
    isAuthenticated: Cookies.get("isLoggedIn") === "true",
  });

  const handleLogIn = () => {
    setAuthState({
      isAuthenticated: true,
    });
  };

  const logOutMutation = useMutation(logOut, {
    onSuccess: () => {
      // When setting isAuthenticated to false redirect is handled by each authenticated page
      setAuthState((state) => ({ ...state, isAuthenticated: false }));
      queryClient.setQueryData("user", null);
    },
  });

  const handleLogOut = () => {
    logOutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        value: authState,
        actions: {
          handleLogIn,
          handleLogOut,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const data = useContext(AuthContext);
  return data;
};
