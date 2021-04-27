import React, { useState, createContext, useContext } from "react";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const queryClient = useQueryClient();

  const [authState, setAuthState] = useState({
    // @TODO: Check how to get initial logged state
    // cant access httpOnly cookies
    isAuthenticated: false,
  });

  const handleLogIn = () => {
    setAuthState({
      isAuthenticated: true,
    });
  };

  const logOutMutation = useMutation(logOut, {
    onSuccess: () => {
      router.push("/");
      // @TODO: check how to solve user is null and page is still showing dashboard (page throw error)
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
