"use client";

import { createContext, useContext } from "react";

export const StepContext = createContext<number>(0);

export const useCurrentStep = () => useContext(StepContext);
