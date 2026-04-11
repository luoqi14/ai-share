"use client";

import { createContext, useContext } from "react";

export const OverviewContext = createContext(false);

export const useIsOverview = () => useContext(OverviewContext);
