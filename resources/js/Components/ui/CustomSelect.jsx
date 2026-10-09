import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export default function CustomSelect({
    id,
    label,
    options = [],
    value = '',
    onChange,
    placeholder = 'Select...',
    searchable = false,
    disabled = false,
    error = false,
    className = '',
    style = {},
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    const selected = options.find((o) => String(o.value) === String(value));

    const filtered = searchable && query.trim()
        ? options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase()) ||
            (o.sub && o.sub.toLowerCase().includes(query.toLowerCase()))
        )
        : options;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (open && searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 60);
        }
    }, [open, searchable]);

    const handleSelect = (opt) => {
        onChange(opt.value);
        setOpen(false);
        setQuery('');
    };

    return (
        <div
            ref={containerRef}
            className={`custom-select-container ${className}`}
            style={{ position: 'relative', width: '100%', ...style }}
        >
            {/* Trigger Button */}
            <button
                type="button"
                id={id}
                disabled={disabled}
                onClick={() => !disabled && setOpen((prev) => !prev)}
                style={{
                    width: '100%',
                    minHeight: 42,
                    padding: '9px 14px',
                    background: disabled ? 'rgba(30, 30, 53, 0.5)' : '#1e1e35',
                    border: `1px solid ${error ? '#ef4444' : open ? '#6366f1' : 'rgba(99, 102, 241, 0.22)'}`,
                    borderRadius: 10,
                    color: selected ? '#f1f1f8' : '#707090',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    boxShadow: open ? '0 0 0 2px rgba(99, 102, 241, 0.25)' : 'none',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                }}
            >
                <span
                    style={{
                        flex: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: selected ? 500 : 400,
                    }}
                >
                    {selected ? selected.label : placeholder}
                </span>

                <ChevronDown
                    size={16}
                    style={{
                        color: open ? '#818cf8' : '#707090',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                    }}
                />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        background: '#1a1a30',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        borderRadius: 12,
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(99, 102, 241, 0.1)',
                        zIndex: 9999,
                        overflow: 'hidden',
                        animation: 'fadeIn 0.15s ease',
                    }}
                >
                    {/* Search box if searchable */}
                    {searchable && (
                        <div
                            style={{
                                padding: '10px 12px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <Search size={14} color="#707090" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#f1f1f8',
                                    fontSize: 13,
                                    fontFamily: 'inherit',
                                }}
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#707090',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Options list */}
                    <div
                        style={{
                            maxHeight: 220,
                            overflowY: 'auto',
                            padding: '6px',
                        }}
                    >
                        {filtered.length === 0 ? (
                            <div
                                style={{
                                    padding: '12px 14px',
                                    fontSize: 13,
                                    color: '#707090',
                                    textAlign: 'center',
                                }}
                            >
                                No options found
                            </div>
                        ) : (
                            filtered.map((opt) => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '9px 12px',
                                            background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                                            color: isSelected ? '#818cf8' : '#d1d1e0',
                                            border: 'none',
                                            borderRadius: 8,
                                            fontSize: 13.5,
                                            fontWeight: isSelected ? 600 : 400,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.12s ease',
                                            marginBottom: 2,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{opt.label}</span>
                                            {opt.sub && (
                                                <span style={{ fontSize: 11.5, color: '#707090', marginTop: 1 }}>
                                                    {opt.sub}
                                                </span>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <Check size={15} color="#818cf8" style={{ flexShrink: 0, marginLeft: 8 }} />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
