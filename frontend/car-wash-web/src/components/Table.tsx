import React from 'react';

export interface TableColumn<T> {
    key: string;
    header: string;
    align?: 'left' | 'right' | 'center';
    render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;
    emptyMessage?: string;
}

function Table<T>({ columns, rows, rowKey, emptyMessage = 'No data available.' }: TableProps<T>) {
    const alignClass = (align?: 'left' | 'right' | 'center') => {
        if (align === 'right') return 'text-right';
        if (align === 'center') return 'text-center';
        return 'text-left';
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${alignClass(col.align)}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-10 text-center text-sm text-gray-400"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        rows.map(row => (
                            <tr key={rowKey(row)} className="hover:bg-gray-50 transition-colors">
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className={`px-6 py-4 text-sm text-gray-700 ${alignClass(col.align)}`}
                                    >
                                        {col.render(row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
