import {
    ContentAggregator,
    DriverFactory,
} from "@/classes/aggregator/content-aggregator";
import { ContentTree } from "@/components/ContentTreeRenderer";
import { AddLinkForm } from "@/components/forms/AddLink";
import { useRef } from "react";
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

function App() {
    const mainRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="p-4 flex flex-col gap-y-4 w-full h-dvh overflow-hidden">
                <header>
                    <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Tree Test
                    </h1>
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
