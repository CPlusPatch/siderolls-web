import type { ContentAggregator } from "@/classes/aggregator/content-aggregator";
import { UserLinkDriver } from "@/classes/aggregator/drivers/user-link";
import { Button } from "@/components/ui/button";
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
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    url: z.string().url(),
    title: z.string().min(1).optional().default(""),
});

/**
 * UI component for adding a link
 */
export const AddLinkForm: FC<{ aggregator: ContentAggregator }> = ({
    aggregator,
}) => {
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const driver = new UserLinkDriver();
        const content = driver.parseContent({
            url: values.url,
            title: values.title,
        });
        await aggregator.storeContent(content);
        form.reset();
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
            title: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Link Title" {...field} />
                            </FormControl>
                            <FormDescription>
                                Optional title for the link
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                                <Input placeholder="Link URL" {...field} />
                            </FormControl>
                            <FormDescription>URL of the link</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Add
                </Button>
            </form>
        </Form>
    );
};
