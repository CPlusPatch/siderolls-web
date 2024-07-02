import type { SidepageAggregator } from "@/classes/aggregator/content-aggregator";
import { UserLinkDriver } from "@/classes/aggregator/drivers/user-link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Icon } from "@iconify-icon/react";
import { Loader2 } from "lucide-react";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    url: z.string().url(),
    title: z.string().min(1).optional().default(""),
});

export const AddLinkDialog: FC<{ aggregator: SidepageAggregator }> = ({
    aggregator,
}) => {
    const [open, setOpen] = useState(false);
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
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
            title: "",
        },
    });

    const getTab = async () => {
        const currentTabs = await browser.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        return currentTabs[0];
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button variant="default">
                    <Icon
                        icon="tabler:link-plus"
                        className="size-5 mr-2"
                        width="none"
                    />
                    Add Link
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <DialogTitle className="text-center">
                            Add Link
                        </DialogTitle>
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
                                        <Button
                                            variant="link"
                                            type="button"
                                            className="!p-0 h-[unset]"
                                            onClick={async () =>
                                                form.setValue(
                                                    "title",
                                                    (await getTab()).title ??
                                                        "",
                                                )
                                            }
                                        >
                                            Use current tab
                                        </Button>
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
                                    <FormControl>
                                        <Input
                                            placeholder="Link URL"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="flex flex-row justify-between items-center">
                                        <span>URL of the link</span>
                                        <Button
                                            variant="link"
                                            type="button"
                                            className="!p-0 h-[unset]"
                                            onClick={async () =>
                                                form.setValue(
                                                    "url",
                                                    (await getTab()).url ?? "",
                                                )
                                            }
                                        >
                                            Use current tab
                                        </Button>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
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
                            <DialogClose asChild={true}>
                                <Button
                                    type="reset"
                                    variant="link"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
