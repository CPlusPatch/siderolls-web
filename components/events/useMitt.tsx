"use client";

import mitt, { type Emitter } from "mitt";
import { type FC, type ReactNode, createContext, useContext } from "react";

type EmitterEvents = {
    "create-content": undefined;
};
const emitter: Emitter<EmitterEvents> = mitt();

export interface MittContextType {
    emitter: Emitter<EmitterEvents>;
}

const MittContext = createContext<MittContextType>({ emitter });

export const MittProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MittContext.Provider value={{ emitter }}>
            {children}
        </MittContext.Provider>
    );
};

export const useMitt = (): MittContextType => useContext(MittContext);
