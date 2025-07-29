import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';

const SortableClientRow = ({ id, client }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: isDragging ? 'rgba(239, 246, 255, 0.5)' : 'white',
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`${isDragging ? 'opacity-50 shadow-lg' : ''}`}
        >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900">
                {client.clientId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900">
                {client.clientName.charAt(0).toUpperCase() + client.clientName.slice(1)}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900 capitalize">
                {client.clientType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900">
                {client.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-gray-900">
                {new Date(client.createdAt).toLocaleDateString()}
            </td>

        </tr>
    );
};

export default SortableClientRow;