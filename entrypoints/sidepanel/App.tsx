import {
    ContentAggregator,
    DriverFactory,
} from "@/classes/aggregator/content-aggregator";
import { ContentTree } from "@/components/ContentTreeRenderer";
import { AddLinkForm } from "@/components/forms/AddLink";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { storage } from "wxt/storage";

const aggregator = new ContentAggregator(storage);

// Add content drivers
const rssDriver = DriverFactory.createDriver("rss", {
    feedUrl: "https://example.com/feed",
});
const twitterDriver = DriverFactory.createDriver("twitter", {
    username: "example_user",
});

aggregator.addDriver(rssDriver);
aggregator.addDriver(twitterDriver);

const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return [darkMode, setDarkMode] as const;
};

function App() {
    const mainRef = useRef<HTMLDivElement>(null);
    const [darkMode, setDarkMode] = useDarkMode();

    return (
        <>
            <div className="p-4 flex flex-col gap-y-4 w-full h-dvh overflow-hidden">
                <header className="flex flex-row border-b justify-between items-center">
                    <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Tree Test
                    </h1>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="dark-mode"
                            defaultChecked={darkMode}
                            onCheckedChange={() => setDarkMode((prev) => !prev)}
                        />
                        <Label htmlFor="dark-mode" className="sr-only">
                            Airplane Mode
                        </Label>
                    </div>
                </header>
                <AddLinkForm aggregator={aggregator} />
                <main className="grow" ref={mainRef}>
                    <ContentTree aggregator={aggregator} />
                </main>
            </div>
        </>
    );
}

export default App;
