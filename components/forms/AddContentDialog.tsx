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
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApi } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RichTextEditor } from "../editor/editor";

const TRIGGER_SEQUENCE = "admin";

const formSchema = z.object({
    title: z.string().min(1),
    image: z.string().url(),
    content: z.string().min(1),
});

export function AddContentDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]);
    const api = useApi();
    const router = useRouter();

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const output = await api.createRow({
            title: data.title,
            banner_image: data.image,
            content: data.content,
            tags: [],
            links: [],
        });

        setIsDialogOpen(false);

        // Go to /feed/[id]
        router.push(`/feed/${output.id}`);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(n) => setIsDialogOpen(n)}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add new content</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to add new content to the
                        sidepage.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-4">
                                        <FormLabel htmlFor="title">
                                            Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="title"
                                                placeholder="My Cool Title"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-4">
                                        <FormLabel htmlFor="image">
                                            Image URL
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="image"
                                                placeholder="https://example.com/image.jpg"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-4">
                                        <FormLabel htmlFor="content">
                                            Content
                                        </FormLabel>
                                        <RichTextEditor
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            onEdit={(v) =>
                                                form.setValue("content", v)
                                            }
                                        />
                                        <FormMessage />
                                        <FormControl>
                                            <textarea
                                                className="hidden"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
