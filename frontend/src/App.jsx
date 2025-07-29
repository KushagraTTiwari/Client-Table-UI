import React from 'react';
import ClientTable from './components/ClientTable';
import { ClientsProvider } from './context/ClientContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ClientsProvider>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Clients</h1>
          <ClientTable />
        </div>
      </ClientsProvider>
    </div>
  );
}

export default App;