import React, {useEffect, useRef, useState} from 'react';
import {ReeverEditor} from 'reever-editor';
import {Bold, Heading1, Heading2, Heading3, Italic, Underline} from "lucide-react";

function App() {
    const editorRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const editorInstance = useRef<ReeverEditor | null>(null);
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        heading: '',
        unorderedList: false,
    });
    const [slashMenuVisible, setSlashMenuVisible] = useState(false);
    const [slashNode, setSlashNode] = useState<Text | null>(null);
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const [slashFilter, setSlashFilter] = useState('');

    const slashMenuItems = [
        { label: 'Bold', action: () => editorInstance.current?.bold() },
        { label: 'Italic', action: () => editorInstance.current?.italic() },
        { label: 'Underline', action: () => editorInstance.current?.underline() },
        { label: 'Heading 1', action: () => editorInstance.current?.toggleHeading(1) },
        { label: 'Heading 2', action: () => editorInstance.current?.toggleHeading(2) },
        { label: 'Heading 3', action: () => editorInstance.current?.toggleHeading(3) },
        { label: 'Liste', action: () => editorInstance.current?.unorderedList() },
    ];

    const filteredMenuItems = slashMenuItems.filter(item =>
        item.label.toLowerCase().includes(slashFilter.toLowerCase())
    );

    useEffect(() => {
        if (editorRef.current) {
            editorInstance.current = new ReeverEditor(`#${editorRef.current.id}`);
            editorInstance.current.setContent("Editör burada olacak...");
        }

        const handleSlashKey = (e: globalThis.KeyboardEvent) => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const { startOffset, startContainer } = range;

            if (e.key === '/') {
                const textContent = startContainer.textContent || '';
                const textBeforeCursor = textContent.slice(0, startOffset);

                if (textBeforeCursor === '' || textBeforeCursor.endsWith(' ')) {
                    e.preventDefault();

                    const newSlashNode = document.createTextNode('/');
                    range.insertNode(newSlashNode);
                    range.setStartAfter(newSlashNode);
                    range.collapse(true);

                    selection.removeAllRanges();
                    selection.addRange(range);

                    setSlashNode(newSlashNode);
                    const rect = newSlashNode.parentElement!.getBoundingClientRect();
                    setMenuPosition({ x: rect.left, y: rect.bottom + window.scrollY + 10 });
                    setSlashMenuVisible(true);
                    setSlashFilter('');
                }
            } else if (slashMenuVisible && /^[a-zA-Z0-9ğüşöçıİĞÜŞÇÖı\s]$/.test(e.key) && e.key.length === 1) {
                setSlashFilter((prev) => prev + e.key);
            } else if (slashMenuVisible && e.key === 'Backspace') {
                setSlashFilter((prev) => prev.slice(0, -1));
            }
        };

        document.addEventListener('keydown', handleSlashKey);

        return () => {
            document.removeEventListener('keydown', handleSlashKey);
        };
    }, []);

    useEffect(() => {
        const handleEnterKey = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    const selection = window.getSelection();
                    if (!selection) return;

                    document.execCommand('insertParagraph');  // Yeni paragraf oluşturur
                    document.execCommand('outdent');          // Liste varsa dışarı çıkarır

                    if (editorInstance.current?.queryCommandState('bold'))
                        editorInstance.current.bold();

                    if (editorInstance.current?.queryCommandState('italic'))
                        editorInstance.current.italic();

                    if (editorInstance.current?.queryCommandState('underline'))
                        editorInstance.current.underline();

                    editorInstance.current?.toggleHeading(0);

                    setActiveStates({
                        bold: false,
                        italic: false,
                        underline: false,
                        heading: '',
                        unorderedList: false,
                    });
                }, 0);
            }
        };

        document.addEventListener('keydown', handleEnterKey);

        return () => {
            document.removeEventListener('keydown', handleEnterKey);
        };
    }, []);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed && toolbarRef.current) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                toolbarRef.current.style.top = `${rect.top + window.scrollY - 50}px`;
                toolbarRef.current.style.left = `${rect.left}px`;
                toolbarRef.current.style.display = 'flex';

                setActiveStates({
                    bold: !!editorInstance.current?.queryCommandState('bold'),
                    italic: !!editorInstance.current?.queryCommandState('italic'),
                    underline: !!editorInstance.current?.queryCommandState('underline'),
                    heading: editorInstance.current?.queryFormatBlock() || '',
                    unorderedList: !!editorInstance.current?.queryCommandState('insertUnorderedList'),
                });
            } else if (toolbarRef.current) {
                toolbarRef.current.style.display = 'none';
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (slashMenuVisible && editorRef.current) {
                const targetNode = e.target as Node;
                if (!editorRef.current.contains(targetNode) || (slashNode && !slashNode.parentNode?.contains(targetNode))) {
                    setSlashMenuVisible(false);
                    setSlashNode(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [slashMenuVisible, editorRef, slashNode]);

    const execAndUpdate = (command: () => void, removeSlash = false) => (e: React.MouseEvent) => {
        e.preventDefault();

        if (removeSlash && slashNode && slashNode.parentNode) {
            const selection = window.getSelection();
            const parentNode = slashNode.parentNode;
            const nextSibling = slashNode.nextSibling;

            slashNode.remove();

            const newRange = document.createRange();

            if (nextSibling) {
                newRange.setStartBefore(nextSibling);
            } else {
                newRange.setStart(parentNode, parentNode.childNodes.length);
            }

            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);

            setSlashNode(null);
        }

        setSlashMenuVisible(false);

        setTimeout(() => {
            editorRef.current?.focus();
            command();

            setActiveStates({
                bold: !!editorInstance.current?.queryCommandState('bold'),
                italic: !!editorInstance.current?.queryCommandState('italic'),
                underline: !!editorInstance.current?.queryCommandState('underline'),
                heading: editorInstance.current?.queryFormatBlock() || '',
                unorderedList: !!editorInstance.current?.queryCommandState('insertUnorderedList'),
            });
        }, 0);
    };

    return (
        <div style={{padding: 20, position: 'relative', fontFamily: 'Inter, sans-serif'}}>
            <h1>Reever Editor Test 🚀</h1>

            <div
                ref={toolbarRef}
                id="toolbar"
                style={{
                    position: 'absolute',
                    display: 'none',
                    gap: '8px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                <button
                    onMouseDown={execAndUpdate(() => editorInstance.current?.bold())}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: activeStates.bold ? '#555' : 'transparent',
                        color: activeStates.bold ? '#fff' : '#ccc',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    Bold
                </button>
                <button
                    onMouseDown={execAndUpdate(() => editorInstance.current?.italic())}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: activeStates.italic ? '#555' : 'transparent',
                        color: activeStates.italic ? '#fff' : '#ccc',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    Italic
                </button>
                <button
                    onMouseDown={execAndUpdate(() => editorInstance.current?.underline())}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: activeStates.underline ? '#555' : 'transparent',
                        color: activeStates.underline ? '#fff' : '#ccc',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    Underline
                </button>
                <button
                    onMouseDown={execAndUpdate(() => editorInstance.current?.toggleHeading(1))}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: activeStates.heading === 'h1' ? '#555' : 'transparent',
                        color: activeStates.heading === 'h1' ? '#fff' : '#ccc',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    Heading 1
                </button>
                <button
                    onMouseDown={execAndUpdate(() => editorInstance.current?.toggleHeading(2))}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: activeStates.heading === 'h2' ? '#555' : 'transparent',
                        color: activeStates.heading === 'h2' ? '#fff' : '#ccc',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    Heading 2
                </button>
                <button
                    onMouseDown={execAndUpdate(() => editorInstance.current?.toggleHeading(3))}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: activeStates.heading === 'h3' ? '#555' : 'transparent',
                        color: activeStates.heading === 'h3' ? '#fff' : '#ccc',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    Heading 3
                </button>
                <button
                    onMouseDown={execAndUpdate(() => editorInstance.current?.unorderedList())}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: activeStates.unorderedList ? '#555' : 'transparent',
                        color: activeStates.unorderedList ? '#fff' : '#ccc',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    Liste
                </button>
            </div>

            <div
                ref={editorRef}
                id="editor"
                style={{minHeight: 200, border: "1px solid gray", padding: 10, borderRadius: 8}}
                contentEditable={true}
                suppressContentEditableWarning={true}
            />

            {slashMenuVisible && (
                <div style={{
                    position: 'absolute',
                    top: menuPosition.y,
                    left: menuPosition.x,
                    background: "#fff",
                    color: "#333",
                    padding: "8px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    width: "200px",
                    zIndex: 200,
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontFamily: "Inter, sans-serif",
                }}>
                    {slashMenuItems
                        .filter(item => item.label.toLowerCase().startsWith(slashFilter.toLowerCase()))
                        .map(item => (
                            <div
                                key={item.label}
                                style={{ cursor: 'pointer' }}
                                onMouseDown={execAndUpdate(item.action, true)}
                            >
                                {item.label}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default App;