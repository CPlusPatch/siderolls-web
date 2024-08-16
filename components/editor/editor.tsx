import { escapeHTML } from "@wordpress/escape-html";
import isHotkey from "is-hotkey";
import { type FC, useCallback, useEffect, useMemo } from "react";
import type { BaseEditor } from "slate";
import { type Descendant, Editor, Text, createEditor } from "slate";
import { withHistory } from "slate-history";
import {
    Editable,
    type RenderElementProps,
    type RenderLeafProps,
    Slate,
    withReact,
} from "slate-react";

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+`": "code",
};

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

    const children = node.children.map((n) => serializeToHtml(n)).join("");

    switch (node.type) {
        case "block-quote":
            return `<blockquote><p>${children}</p></blockquote>`;
        case "paragraph":
            return `<p>${children}</p>`;
        case "link":
            return `<a href="${escapeHTML(node.url)}">${children}</a>`;
        case "bulleted-list":
            return `<ul>${children}</ul>`;
        case "numbered-list":
            return `<ol>${children}</ol>`;
        case "list-item":
            return `<li>${children}</li>`;
        case "heading-one":
            return `<h1>${children}</h1>`;
        case "heading-two":
            return `<h2>${children}</h2>`;
        case "heading-three":
            return `<h3>${children}</h3>`;
        default:
            return children;
    }
};

export const RichTextEditor: FC<{
    onEdit?: (value: string) => void;
    disabled?: boolean;
}> = ({ onEdit, disabled }) => {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        [],
    );
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        [],
    );
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    useEffect(() => {
        // If initial value, call onEdit to set the initial value
        onEdit?.(initialValue.map(serializeToHtml).join(""));
    });

    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(value) => {
                onEdit?.(value.map(serializeToHtml).join(""));
            }}
        >
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some rich text…"
                spellCheck={true}
                autoFocus={true}
                data-disabled={disabled || undefined}
                className="h-96 w-full rounded-md border border-input bg-background p-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 prose dark:prose-invert !max-w-full"
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
        </Slate>
    );
};

const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
};

const Element: FC<RenderElementProps> = ({ attributes, children, element }) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case "block-quote":
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            );
        case "bulleted-list":
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            );
        case "heading-one":
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            );
        case "heading-two":
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            );
        case "heading-three":
            return (
                <h3 style={style} {...attributes}>
                    {children}
                </h3>
            );
        case "list-item":
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case "numbered-list":
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            );
        case "paragraph":
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
        case "link":
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

type CustomBaseElement = { align?: "left" | "center" | "right" };
type CustomParagraph = CustomBaseElement & {
    type: "paragraph";
    children: CustomText[];
};
type CustomText = {
    text: string;
    bold?: true;
    italic?: true;
    underline?: true;
    code?: true;
};
type CustomBlockQuote = CustomBaseElement & {
    type: "block-quote";
    children: CustomText[];
};
type CustomBulletedList = CustomBaseElement & {
    type: "bulleted-list";
    children: CustomListItem[];
};
type CustomNumberedList = CustomBaseElement & {
    type: "numbered-list";
    children: CustomListItem[];
};
type CustomListItem = CustomBaseElement & {
    type: "list-item";
    children: CustomText[];
};
type CustomHeadingOne = CustomBaseElement & {
    type: "heading-one";
    children: CustomText[];
};
type CustomHeadingTwo = CustomBaseElement & {
    type: "heading-two";
    children: CustomText[];
};
type CustomHeadingThree = CustomBaseElement & {
    type: "heading-three";
    children: CustomText[];
};
type CustomHeading = CustomHeadingOne | CustomHeadingTwo | CustomHeadingThree;
type CustomLink = CustomBaseElement & {
    type: "link";
    url: string;
    children: CustomText[];
};
type CustomElement =
    | CustomParagraph
    | CustomBlockQuote
    | CustomBulletedList
    | CustomNumberedList
    | CustomListItem
    | CustomHeading
    | CustomLink;

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [
            { text: "This is editable " },
            { text: "rich", bold: true },
            { text: " text, " },
            { text: "much", italic: true },
            { text: " better than a " },
            { text: "<textarea>", code: true },
            { text: "!" },
        ],
    },
    {
        type: "paragraph",
        children: [
            {
                text: "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: "bold", bold: true },
            {
                text: ", or add a semantically rendered block quote in the middle of the page, like this:",
            },
        ],
    },
    {
        type: "block-quote",
        children: [{ text: "A wise quote." }],
    },
];
