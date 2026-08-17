"use client";

import React, { ReactNode } from "react";

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return <>{children}</>;
}
