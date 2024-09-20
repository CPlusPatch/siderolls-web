import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { escapeHTML } from "@wordpress/escape-html";
import isHotkey from "is-hotkey";
import { type FC, memo, useCallback, useMemo } from "react";
import { type BaseEditor, Element as SlateElement } from "slate";
import { type Descendant, Editor, Text, Transforms, createEditor } from "slate";
import { type HistoryEditor, withHistory } from "slate-history";
import {
    Editable,
    type ReactEditor,
    type RenderElementProps,
    type RenderLeafProps,
    Slate,
    useSlate,
    withReact,
} from "slate-react";
import { ToggleGroup } from "../ui/toggle-group.tsx";
import { Toggle } from "../ui/toggle.tsx";

const serializeToHtml = (node: Descendant): string => {
    if (Text.isText(node)) {
        let string = escapeHTML(node.text);
        if (node.bold) {
            string = `<strong>${string}</strong>`;
        }
        if (node.italic) {
            string = `<em>${string}</em>`;
        }
        if (node.underline) {
            string = `<u>${string}</u>`;
        }
        if (node.code) {
            string = `<code>${string}</code>`;
        }
        return string;
    }

    const children =
        node.type === BlockType.Image
            ? []
            : node.children.map((n) => serializeToHtml(n)).join("");

    switch (node.type) {
        case BlockType.BlockQuote:
            return `<blockquote>${children}</blockquote>`;
        case BlockType.Paragraph:
            return `<p>${children}</p>`;
        case BlockType.Link:
            return `<a href="${escapeHTML(node.url)}">${children}</a>`;
        case BlockType.UnorderedList:
            return `<ul>${children}</ul>`;
        case BlockType.OrderedList:
            return `<ol>${children}</ol>`;
        case BlockType.ListItem:
            return `<li>${children}</li>`;
        case BlockType.Heading:
            return `<h1>${children}</h1>`;
        case BlockType.CodeBlock:
            return `<pre><code>${children}</code></pre>`;
        case BlockType.CodeLine:
            return `<code>${children}</code>`;
        case BlockType.QuoteLine:
            return `<p>${children}</p>`;
        case BlockType.Emoticon:
            return `<span>${children}</span>`;
        case BlockType.Image:
            return `<img src="${escapeHTML(node.url)}" alt="${escapeHTML(
                node.alt,
            )}" />${children}`;
        default:
            return "";
    }
};

const htmlNodeToSlate = (node: Node): Descendant => {
    if (node.nodeType === Node.TEXT_NODE) {
        return {
            text: node.nodeValue ?? "",
        };
    }

    switch (node.nodeName) {
        case "P": {
            if (node.childNodes.length > 0) {
                return {
                    type: BlockType.Paragraph,
                    children: Array.from(node.childNodes)
                        .map((node) =>
                            node.nodeType === Node.TEXT_NODE
                                ? { text: node.nodeValue ?? "" }
                                : undefined,
                        )
                        .filter(Boolean) as CustomText[],
                };
            }

            return {
                type: BlockType.Paragraph,
                children: [{ text: "" }],
            };
        }
        case "BLOCKQUOTE":
            return {
                type: BlockType.BlockQuote,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeName === "P"
                            ? htmlNodeToSlate(node)
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "UL":
            return {
                type: BlockType.UnorderedList,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeName === "LI"
                            ? htmlNodeToSlate(node)
                            : undefined,
                    )
                    .filter(Boolean) as CustomListItem[],
            };
        case "OL":
            return {
                type: BlockType.OrderedList,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeName === "LI"
                            ? htmlNodeToSlate(node)
                            : undefined,
                    )
                    .filter(Boolean) as CustomListItem[],
            };
        case "LI":
            return {
                type: BlockType.ListItem,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeType === Node.TEXT_NODE
                            ? { text: node.nodeValue ?? "" }
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "H1":
            return {
                type: BlockType.Heading,
                level: 1,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeType === Node.TEXT_NODE
                            ? { text: node.nodeValue ?? "" }
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "H2":
            return {
                type: BlockType.Heading,
                level: 2,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeType === Node.TEXT_NODE
                            ? { text: node.nodeValue ?? "" }
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "H3":
            return {
                type: BlockType.Heading,
                level: 3,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeType === Node.TEXT_NODE
                            ? { text: node.nodeValue ?? "" }
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "A":
            return {
                type: BlockType.Link,
                url: (node as HTMLAnchorElement).href,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeType === Node.TEXT_NODE
                            ? { text: node.nodeValue ?? "" }
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "PRE":
            return {
                type: BlockType.CodeBlock,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeName === "CODE"
                            ? htmlNodeToSlate(node)
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "CODE":
            return {
                type: BlockType.CodeLine,
                children: Array.from(node.childNodes)
                    .map((node) =>
                        node.nodeType === Node.TEXT_NODE
                            ? { text: node.nodeValue ?? "" }
                            : undefined,
                    )
                    .filter(Boolean) as CustomText[],
            };
        case "IMG":
            return {
                type: BlockType.Image,
                url: (node as HTMLImageElement).src,
                alt: (node as HTMLImageElement).alt,
            };
        default:
            return {
                text: "",
            };
    }
};

const htmlToSlate = (html: string): Descendant[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body;
    const children: Descendant[] = [];
    if (body) {
        for (const node of body.childNodes) {
            children.push(htmlNodeToSlate(node));
        }
    }
    return children;
};

export const RichTextEditor: FC<{
    onEdit?: (value: string) => void;
    initialValue?: string;
    disabled?: boolean;
}> = memo(({ onEdit, disabled, initialValue }) => {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        [],
    );
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        [],
    );
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    return (
        <Slate
            editor={editor}
            initialValue={
                initialValue ? htmlToSlate(initialValue) : defaultInitialValue
            }
            onChange={(value) => {
                onEdit?.(value.map(serializeToHtml).join(""));
            }}
        >
            <div
                className={
                    "flex flex-col gap-4 w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 p-4 focus-within:ring-ring focus-within:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 prose dark:prose-invert !max-w-full"
                }
            >
                <ToggleGroup type="single" className="justify-start">
                    <BlockButton
                        format={BlockType.Heading}
                        icon="mdi-format-header-1"
                    />
                    <BlockButton
                        format={BlockType.BlockQuote}
                        icon="mdi-format-quote-open"
                    />
                    <BlockButton
                        format={BlockType.OrderedList}
                        icon="mdi-format-list-numbered"
                    />
                    <BlockButton
                        format={BlockType.UnorderedList}
                        icon="mdi-format-list-bulleted"
                    />
                    <BlockButton
                        format={BlockType.CodeBlock}
                        icon="mdi-code-tags"
                    />
                    <BlockButton
                        format={BlockType.Link}
                        icon="mdi-link-variant"
                    />
                    <BlockButton format={BlockType.Image} icon="mdi-image" />
                    <MarkButton format={MarkType.Bold} icon="mdi-format-bold" />
                    <MarkButton
                        format={MarkType.Italic}
                        icon="mdi-format-italic"
                    />
                    <MarkButton
                        format={MarkType.Underline}
                        icon="mdi-format-underline"
                    />
                    <MarkButton format={MarkType.Code} icon="mdi-code-tags" />
                    <MarkButton
                        format={MarkType.StrikeThrough}
                        icon="mdi-format-strikethrough"
                    />
                </ToggleGroup>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some rich text…"
                    spellCheck={true}
                    autoFocus={true}
                    data-disabled={disabled || undefined}
                    className="h-96 focus:outline-none prose-p:my-0 overflow-auto"
                    onKeyDown={(event) => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event)) {
                                event.preventDefault();
                                const mark =
                                    HOTKEYS[hotkey as keyof typeof HOTKEYS];
                                toggleMark(editor, mark);
                            }
                        }
                    }}
                />
            </div>
        </Slate>
    );
});

export const BlockButton: FC<{
    format: BlockType;
    icon: string;
}> = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Toggle
            pressed={isBlockActive(editor, format)}
            onClick={(event) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
            variant="outline"
        >
            <Icon icon={icon} />
        </Toggle>
    );
};

export const MarkButton: FC<{
    format: MarkType;
    icon: string;
}> = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Toggle
            pressed={isMarkActive(editor, format)}
            onClick={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
            variant="outline"
        >
            <Icon icon={icon} />
        </Toggle>
    );
};

type HeadingLevel = 1 | 2 | 3;
type BlockOption = { level: HeadingLevel };

const toggleBlock = (
    editor: Editor,
    format: BlockType,
    option?: BlockOption,
) => {
    Transforms.collapse(editor, {
        edge: "end",
    });
    const isActive = isBlockActive(editor, format);

    Transforms.unwrapNodes(editor, {
        match: (node) =>
            SlateElement.isElement(node) && NESTED_BLOCK.includes(node.type),
        split: true,
    });

    if (isActive) {
        Transforms.setNodes(editor, {
            type: BlockType.Paragraph,
        });
        return;
    }

    switch (format) {
        case BlockType.OrderedList:
        case BlockType.UnorderedList: {
            Transforms.setNodes(editor, {
                type: BlockType.ListItem,
            });
            const listBlock = {
                type: format,
                children: [],
            };
            Transforms.wrapNodes(editor, listBlock);
            return;
        }
        case BlockType.CodeBlock: {
            Transforms.setNodes(editor, {
                type: BlockType.CodeLine,
            });
            const codeBlock = {
                type: format,
                children: [],
            };
            Transforms.wrapNodes(editor, codeBlock);
            return;
        }
        case BlockType.BlockQuote: {
            Transforms.setNodes(editor, {
                type: BlockType.QuoteLine,
            });
            const quoteBlock = {
                type: format,
                children: [],
            };
            Transforms.wrapNodes(editor, quoteBlock);
            return;
        }
        case BlockType.Heading:
            Transforms.setNodes(editor, {
                type: format,
                level: option?.level ?? 1,
            });
            break;
        case BlockType.Link: {
            const url = window.prompt("Enter the URL of the link:");
            if (!url) {
                return;
            }
            Transforms.wrapNodes(editor, {
                type: format,
                url,
                children: [],
            });
            break;
        }
        case BlockType.Image: {
            const url = window.prompt("Enter the URL of the image:");
            if (!url) {
                return;
            }

            /* const alt = window.prompt("Enter the alt text of the image:");
            if (!alt) {
                return;
            } */

            Transforms.insertNodes(editor, {
                type: format,
                url,
                alt: "",
            });

            break;
        }
        default:
            Transforms.setNodes(editor, {
                type: format,
            });
            break;
    }
};

const isBlockActive = (editor: Editor, format: BlockType) => {
    const [match] = Editor.nodes(editor, {
        match: (node) => SlateElement.isElement(node) && node.type === format,
    });

    return !!match;
};

const toggleMark = (editor: Editor, format: MarkType) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isMarkActive = (editor: Editor, format: MarkType) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const Element: FC<RenderElementProps> = ({ attributes, children, element }) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case BlockType.BlockQuote:
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            );
        case BlockType.UnorderedList:
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            );
        case BlockType.Heading:
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            );
        case BlockType.ListItem:
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case BlockType.OrderedList:
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            );
        case BlockType.Paragraph:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
        case BlockType.QuoteLine:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
        case BlockType.Image:
            return (
                // biome-ignore lint/a11y/useAltText: there is literally alt text
                <img
                    style={style}
                    src={element.url}
                    alt={element.alt}
                    {...attributes}
                />
            );
        case BlockType.Link:
            return (
                <a
                    style={style}
                    href={element.url}
                    {...attributes}
                    target="_blank"
                    rel="noreferrer"
                >
                    {children}
                </a>
            );
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

const Leaf: FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

export enum MarkType {
    Bold = "bold",
    Italic = "italic",
    Underline = "underline",
    StrikeThrough = "strikeThrough",
    Code = "code",
    Spoiler = "spoiler",
}

export enum BlockType {
    Paragraph = "paragraph",
    Heading = "heading",
    CodeLine = "code-line",
    CodeBlock = "code-block",
    QuoteLine = "quote-line",
    BlockQuote = "block-quote",
    ListItem = "list-item",
    OrderedList = "ordered-list",
    UnorderedList = "unordered-list",
    Emoticon = "emoticon",
    Link = "link",
    Image = "image",
}

const HOTKEYS = {
    "mod+b": MarkType.Bold,
    "mod+i": MarkType.Italic,
    "mod+u": MarkType.Underline,
    "mod+`": MarkType.Code,
};

const NESTED_BLOCK = [
    BlockType.OrderedList,
    BlockType.UnorderedList,
    BlockType.BlockQuote,
    BlockType.CodeBlock,
];

type CustomBaseElement = { align?: "left" | "center" | "right" };
type CustomParagraph = CustomBaseElement & {
    type: BlockType.Paragraph;
    children: CustomText[];
};
type CustomText = {
    text: string;
    bold?: true;
    italic?: true;
    underline?: true;
    code?: true;
    strikeThrough?: true;
    spoiler?: true;
    emoticon?: true;
    mention?: true;
};
type CustomBlockQuote = CustomBaseElement & {
    type: BlockType.BlockQuote;
    children: CustomText[];
};
type CustomHeading = CustomBaseElement & {
    type: BlockType.Heading;
    level: 1 | 2 | 3;
    children: CustomText[];
};
type CustomListItem = CustomBaseElement & {
    type: BlockType.ListItem;
    children: CustomText[];
};
type CustomOrderedList = CustomBaseElement & {
    type: BlockType.OrderedList;
    children: CustomListItem[];
};
type CustomUnorderedList = CustomBaseElement & {
    type: BlockType.UnorderedList;
    children: CustomListItem[];
};
type CustomLink = CustomBaseElement & {
    type: BlockType.Link;
    url: string;
    children: CustomText[];
};
type CustomCodeBlock = CustomBaseElement & {
    type: BlockType.CodeBlock;
    children: CustomText[];
};
type CustomCodeLine = CustomBaseElement & {
    type: BlockType.CodeLine;
    children: CustomText[];
};
type CustomQuoteLine = CustomBaseElement & {
    type: BlockType.QuoteLine;
    children: CustomText[];
};
type CustomEmoticon = CustomBaseElement & {
    type: BlockType.Emoticon;
    children: CustomText[];
};
type CustomImage = CustomBaseElement & {
    type: BlockType.Image;
    url: string;
    alt: string;
};
type CustomElement =
    | CustomParagraph
    | CustomBlockQuote
    | CustomHeading
    | CustomOrderedList
    | CustomUnorderedList
    | CustomListItem
    | CustomLink
    | CustomQuoteLine
    | CustomCodeBlock
    | CustomCodeLine
    | CustomEmoticon
    | CustomImage;

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

const defaultInitialValue: Descendant[] = [
    // Single text node
    {
        type: BlockType.Paragraph,
        children: [{ text: "" }],
    },
];
