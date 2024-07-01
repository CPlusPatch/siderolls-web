import { TreeDemo } from "@/components/TreeDemo";
import { useRef } from "react";

function App() {
    const mainRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="p-4 flex flex-col gap-y-4 w-full h-full">
                <header>
                    <h1 className="text-2xl font-bold text-gray-200 leading-tight text-center">
                        Tree Test
                    </h1>
                </header>
                <main className="grow" ref={mainRef}>
                    <TreeDemo containerRef={mainRef} />
                </main>
            </div>
        </>
    );
}

export default App;
