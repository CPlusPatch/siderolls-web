"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

const TRIGGER_SEQUENCE = "admin";

export function AddContentDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const newSequence = [...keySequence, event.key];
            setKeySequence(newSequence);

            if (newSequence.join("") === TRIGGER_SEQUENCE) {
                event.preventDefault();
                setIsDialogOpen(true);
                setKeySequence([]); // Reset the sequence after successful match
            } else if (newSequence.length > TRIGGER_SEQUENCE.length) {
                setKeySequence([]); // Reset if sequence is too long
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [keySequence]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={(n) => setIsDialogOpen(n)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new content</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to add new content to the
                        sidepage.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="My Cool Title" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="type">Image URL</Label>
                        <Input
                            id="image"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="My cool content..."
                            rows={8}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
