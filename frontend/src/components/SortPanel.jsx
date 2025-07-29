import React, { useState, useContext } from 'react';
import { ClientsContext } from '../context/ClientContext';

const SortPanel = () => {
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { setClients } = useContext(ClientsContext);

  const handleSort = () => {
    setClients(prevClients => {
      const sorted = [...prevClients].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      return sorted;
    });
  };

  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex items-center space-x-4">
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="name">Name</option>
          <option value="createdAt">Created At</option>
          <option value="email">Email</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="asc">Ascending (A-Z)</option>
          <option value="desc">Descending (Z-A)</option>
        </select>

        <button
          onClick={handleSort}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Apply Sort
        </button>
      </div>
    </div>
  );
};

export default SortPanel;