"use client";

import { aggregator } from "@/classes/aggregator/content-aggregator";
import { UserLinkDriver } from "@/classes/aggregator/drivers/user-link";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ContentAdderProps } from "./AddContent";

const formSchema = z.object({
    url: z
        .string()
        .url()
        // Has at least one dot
        .refine((v) => v.includes("."), { message: "Invalid URL" })
        .or(
            z
                .string()
                .transform((v) => `https://${v}`)
                // Has at least one dot
                .refine((v) => v.includes("."), { message: "Invalid URL" })
                .refine((v) => URL.canParse(v), { message: "Invalid URL" }),
        ),
    title: z.string().optional().default(""),
});

export const AddLinkDialog: FC<ContentAdderProps> = ({
    open,
    setOpen,
    onAdd,
}) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const driver = new UserLinkDriver();
        const content = await driver.parseContent({
            url: values.url,
            title: values.title,
        });
        const sidepages = await aggregator.fetchAllSidepages();
        await aggregator.addContentToSidepage(sidepages[0].id, content);
        form.reset();
        setLoading(false);
        setOpen(false);
        onAdd?.("link");
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
            title: "",
        },
    });

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerDescription className="sr-only">
                Link input form
            </DrawerDescription>
            <DrawerContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mx-auto w-full max-w-sm p-4"
                    >
                        <DrawerTitle className="sr-only">Add Link</DrawerTitle>
                        <FormField
                            control={form.control}
                            disabled={loading}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Link Title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="flex flex-row justify-between items-center">
                                        <span>Optional title for the link</span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <div className="relative">
                                        <span className="absolute top-2.5 left-3 text-muted-foreground/60 text-sm">
                                            https://
                                        </span>
                                        <FormControl>
                                            <Input
                                                autoCorrect="off"
                                                placeholder="example.com"
                                                className="!pl-16"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormDescription className="flex flex-row justify-between items-center">
                                        <span>URL of the link</span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading && (
                                    <Loader2 className="animate-spin mr-2 size-4" />
                                )}
                                Add
                            </Button>
                            <DrawerClose asChild={true}>
                                <Button
                                    type="reset"
                                    variant="outline"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </DrawerClose>
                        </div>
                    </form>
                </Form>
            </DrawerContent>
        </Drawer>
    );
};
