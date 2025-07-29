import React, { useContext } from 'react';
import { ClientsContext } from '../context/ClientContext';

const ClientFilters = () => {
  const { filter, setFilter } = useContext(ClientsContext);

  return (
    <div className="p-4 border-b">
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('individual')}
          className={`px-3 py-1 rounded-md ${filter === 'individual' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
        >
          Individual
        </button>
        <button
          onClick={() => setFilter('company')}
          className={`px-3 py-1 rounded-md ${filter === 'company' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
        >
          Company
        </button>
      </div>
    </div>
  );
};

export default ClientFilters;