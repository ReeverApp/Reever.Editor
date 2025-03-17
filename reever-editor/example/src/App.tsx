import React, {useEffect, useRef, useState} from 'react';
import {ReeverEditor} from 'reever-editor';

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
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (editorRef.current) {
            editorInstance.current = new ReeverEditor(`#${editorRef.current.id}`);
            editorInstance.current.setContent("Editör burada olacak...");
        }

        const toolbarEl = toolbarRef.current as HTMLDivElement;

        const handleSelection = () => {
            const selection = window.getSelection();
            const toolbarEl = toolbarRef.current;

            if (!toolbarEl) return;

            if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
                if (toolbarEl.style.display === 'flex') return;

                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                toolbarEl.style.top = `${rect.top - toolbarEl.offsetHeight - 60 + window.scrollY}px`;
                toolbarEl.style.left = `${rect.left + rect.width / 2 - toolbarEl.offsetWidth / 2}px`;
                toolbarEl.style.display = 'flex';

                setActiveStates({
                    bold: !!editorInstance.current?.queryCommandState('bold'),
                    italic: !!editorInstance.current?.queryCommandState('italic'),
                    underline: !!editorInstance.current?.queryCommandState('underline'),
                    heading: editorInstance.current?.queryFormatBlock() || '',
                    unorderedList: !!editorInstance.current?.queryCommandState('insertUnorderedList'),
                });
            } else {
                toolbarEl.style.display = 'none';
            }
        };

        const hideToolbar = () => {
            if (toolbarEl) {
                toolbarEl.style.display = 'none';
            }
        };

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                if (editorInstance.current?.queryCommandState('insertUnorderedList')) {
                    document.execCommand('indent');
                    editorRef.current?.focus();
                }
            }
        };

        const handleSlashKey = (e: KeyboardEvent) => {
            if (e.key === '/') {
                setTimeout(() => {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const rect = range.getBoundingClientRect();
                        setMenuPosition({
                            y: rect.top + rect.height + 10 + window.scrollY, // Slash karakterinin altında çıkmasını sağla
                            x: rect.left
                        });
                        setSlashMenuVisible(true);
                    }
                }, 0);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection);
        document.addEventListener('scroll', hideToolbar);
        document.addEventListener('keydown', handleTabKey);
        document.addEventListener('keydown', handleSlashKey);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
            document.removeEventListener('scroll', hideToolbar);
            document.removeEventListener('keydown', handleTabKey);
            document.removeEventListener('keydown', handleSlashKey);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            setSlashMenuVisible(false);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const execAndUpdate = (command: () => void, removeSlash = false) => (e: React.MouseEvent) => {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0).cloneRange();

        if (removeSlash) {
            const { startContainer, startOffset } = range;

            if (startContainer.nodeType === Node.TEXT_NODE && startContainer.textContent) {
                const textContent = startContainer.textContent;

                if (startOffset > 0 && textContent[startOffset - 1] === '/') {
                    const beforeSlash = textContent.substring(0, startOffset - 1);
                    const afterSlash = textContent.substring(startOffset);
                    startContainer.textContent = beforeSlash + afterSlash;

                    // Slash'ı sildikten sonra yeni boş text node ekleyerek imlecin birleşmesini engelle
                    const spaceNode = document.createTextNode('\u00A0');
                    range.insertNode(spaceNode);

                    range.setStartAfter(spaceNode);
                    range.collapse(true);
                }
            }

            selection.removeAllRanges();
            selection.addRange(range);
        }

        setSlashMenuVisible(false);

        setTimeout(() => {
            editorRef.current?.focus();

            selection.removeAllRanges();
            selection.addRange(range);
            selection.collapseToEnd();

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
                    position: "absolute",
                    display: "none",
                    padding: "8px",
                    background: "#333",
                    color: "#fff",
                    borderRadius: "8px",
                    gap: "4px",
                    zIndex: 100,
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <button onMouseDown={execAndUpdate(() => {
                    if (toolbarRef.current) toolbarRef.current.style.display = 'none';
                    editorInstance.current?.bold();
                })}
                        style={{color: activeStates.bold ? 'blue' : 'white'}}>
                    <b>B</b>
                </button>
                <button onMouseDown={execAndUpdate(() => {
                    if (toolbarRef.current) toolbarRef.current.style.display = 'none';
                    editorInstance.current?.italic();
                })}
                        style={{color: activeStates.italic ? 'blue' : 'white'}}>
                    <i>I</i>
                </button>
                <button onMouseDown={execAndUpdate(() => {
                    if (toolbarRef.current) toolbarRef.current.style.display = 'none';
                    editorInstance.current?.underline();
                })}
                        style={{color: activeStates.underline ? 'blue' : 'white'}}>
                    <u>U</u>
                </button>

                <div className="separator" style={{borderLeft: '1px solid #555', height: 20}}/>

                {[1, 2, 3].map(level => (
                    <button key={level}
                            onMouseDown={execAndUpdate(() => {
                                if (toolbarRef.current) toolbarRef.current.style.display = 'none';
                                editorInstance.current?.toggleHeading(level);
                            })}
                            style={{color: activeStates.heading === `h${level}` ? 'blue' : 'white'}}>
                        H{level}
                    </button>
                ))}

                <div className="separator" style={{borderLeft: '1px solid #555', height: 20}}/>

                <button onMouseDown={execAndUpdate(() => {
                    if (toolbarRef.current) toolbarRef.current.style.display = 'none';
                    editorInstance.current?.unorderedList();
                })}
                        style={{color: activeStates.unorderedList ? 'blue' : 'white'}}>
                    • Liste
                </button>

                <button onMouseDown={execAndUpdate(() => {
                    const url = prompt("Görsel URL'sini girin:");
                    if (url) editorInstance.current?.insertImage(url);
                })}>
                    📷 Görsel
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
                    <div style={{ cursor: 'pointer' }} onMouseDown={execAndUpdate(() => editorInstance.current?.bold(), true)}>🔠 Bold</div>
                    <div style={{ cursor: 'pointer' }} onMouseDown={execAndUpdate(() => editorInstance.current?.italic(), true)}>𝑰 Italic</div>
                    <div style={{ cursor: 'pointer' }} onMouseDown={execAndUpdate(() => editorInstance.current?.underline(), true)}>🔽 Underline</div>

                    <hr/>

                    {[1, 2, 3].map(level => (
                        <div key={level} style={{ cursor: 'pointer' }}
                             onMouseDown={execAndUpdate(() => editorInstance.current?.toggleHeading(level), true)}>
                            📌 Heading {level}
                        </div>
                    ))}

                    <hr/>

                    <div style={{ cursor: 'pointer' }} onMouseDown={execAndUpdate(() => editorInstance.current?.unorderedList(), true)}>
                        📋 Liste
                    </div>
                    <div style={{ cursor: 'pointer' }} onMouseDown={execAndUpdate(() => {
                        const url = prompt("Görsel URL'sini girin:");
                        if (url) editorInstance.current?.insertImage(url);
                    })}>
                        🖼️ Görsel Ekle
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;