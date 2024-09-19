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
import { useClient } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RichTextEditor } from "../editor/editor.tsx";
import { useMitt } from "../events/useMitt.tsx";

const formSchema = z.object({
    title: z.string().min(1),
    image: z.string().url().optional(),
    content: z.string().min(1).optional(),
});

export function AddContentDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const client = useClient();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            image: undefined,
            content: undefined,
        },
    });

    useMitt().emitter.on("create-content", () => {
        setIsDialogOpen(true);
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const output = await client?.createRow({
            title: data.title,
            image: data.image,
            content: data.content,
            tags: [],
            links: [],
        });

        setIsDialogOpen(false);

        // Go to /feed/[id]
        router.push(`/feed/${output?.data.id}`);
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
                            <RichTextEditor
                                disabled={form.formState.isSubmitting}
                                onEdit={(v) => {
                                    form.setValue("content", v);
                                }}
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
