import { TreeDemo } from "@/components/TreeDemo";
import { useRef } from "react";

function App() {
    const mainRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <main className="p-4" ref={mainRef}>
                <TreeDemo containerRef={mainRef} />
            </main>
        </>
    );
}

export default App;
