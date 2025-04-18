import React, {useEffect, useRef} from 'react';
import EditorJS, {ToolConstructable} from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import editorjsNestedChecklist from '@calumk/editorjs-nested-checklist';
import DragDrop from 'editorjs-drag-drop';
import createGenericInlineTool from 'editorjs-inline-tool'
import '../editor.css'
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import Delimiter from "@editorjs/delimiter";
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import CategoryHeader from "./CategoryHeader";

const EditorComponent: React.FC = () => {
    const ejInstance = useRef<EditorJS | null>(null);

    useEffect(() => {
        if (!ejInstance.current) {
            ejInstance.current = new EditorJS({
                holder: 'editorjs',
                onReady: () => {
                    new DragDrop(ejInstance.current);
                },
                placeholder: 'Enter your text here...',
                tools: {
                    categoryHeaderBasic: {
                        class: CategoryHeader,
                        inlineToolbar: false,
                        config: { text: 'Basic Blocks' },
                        toolbox: { title: 'Basic Blocks', icon: '<svg width="0" height="0"></svg>' },
                    },
                    paragraph: {
                        class: Paragraph as unknown as ToolConstructable,
                        inlineToolbar: true,
                        toolbox: {
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-type"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>',
                            title: 'Text'
                        }
                    },
                    header: {
                        class: Header as unknown as ToolConstructable,
                        inlineToolbar: ['link'],

                        toolbox: [
                            {
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-1"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>', // H1 için simge
                                title: 'Heading 1',
                                data: {level: 1}
                            },
                            {
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>', // H2 için simge
                                title: 'Heading 2',
                                data: {level: 2}
                            },
                            {
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-3"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>', // H3 için simge
                                title: 'Heading 3',
                                data: {level: 3}
                            }
                        ],
                        config: {
                            placeholder: 'Enter a header',
                            levels: [1, 2, 3],
                            defaultLevel: 1
                        }
                    },
                    list: {
                        class: List as unknown as ToolConstructable,
                        inlineToolbar: true,
                        toolbox: [
                            {
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>',
                                title: 'Unordered list',
                                data: {style: 'unordered'}
                            },
                            {
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-ordered"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>',
                                title: 'Ordered list',
                                data: {style: 'ordered'}
                            }
                        ]
                    },
                    nestedchecklist: {
                        class: editorjsNestedChecklist,
                        inlineToolbar: true,
                        toolbox: {
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-todo"><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>',
                            title: 'To-do list',
                            data: {style: 'none'}
                        },
                    },
                    table: {
                        class: Table as unknown as ToolConstructable,
                        inlineToolbar: true,
                        toolbox: {
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table2-icon lucide-table-2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>',
                            title: 'Table'
                        },
                        config: {
                            rows: 2,
                            cols: 3,
                            withHeadings: true
                        },
                    },
                    image: {
                        class: ImageTool,
                        toolbox: {
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-icon lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
                            title: 'Image'
                        },
                        config: {
                            endpoints: {
                                byFile: '/uploadFile',
                                byUrl: '/fetchUrl',
                            }
                        },
                    },
                    delimiter: {
                        class: Delimiter,
                        toolbox: {
                            icon: '<svg width="24" height="24" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
                            title: 'Delimiter'
                        }
                    },
                    blockquote: {
                        class: Quote,
                        inlineToolbar: true,
                        toolbox: {
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote-icon lucide-quote"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></svg>',
                            title: 'Blockquote'
                        }
                    },
                    code: {
                        class: CodeTool,
                        inlineToolbar: true,
                        toolbox: {
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
                            title: 'Code Block'
                        }
                    },
                    link: {
                        class: createGenericInlineTool({
                            sanitize: {
                                a: {href: true, target: true, rel: true}
                            },
                            shortcut: 'CMD+K',
                            tagName: 'A',
                            toolboxIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
                        }),
                    },
                    bold: {
                        class: createGenericInlineTool({
                            sanitize: {
                                strong: {},
                            },
                            shortcut: 'CMD+B',
                            tagName: 'STRONG',
                            toolboxIcon:
                                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bold"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>',
                        }),
                    },
                    italic: {
                        class: createGenericInlineTool({
                            sanitize: {
                                i: {}
                            },
                            shortcut: 'CMD+I',
                            tagName: 'I',
                            toolboxIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>',
                        }),
                    },
                    underline: {
                        class: createGenericInlineTool({
                            sanitize: {
                                u: {}
                            },
                            shortcut: 'CMD+U',
                            tagName: 'U',
                            toolboxIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-underline"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>',
                        }),
                    },
                    strikethrough: {
                        class: createGenericInlineTool({
                            sanitize: {
                                s: {}
                            },
                            shortcut: 'CMD+SHIFT+S',
                            tagName: 'S',
                            toolboxIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>',
                        }),
                    },

                },
            });
        }

        return () => {
            if (ejInstance.current && ejInstance.current.destroy) {
                ejInstance.current.destroy();
            }
        };
    }, []);

    return <div id="editorjs"></div>;
};

export default EditorComponent;