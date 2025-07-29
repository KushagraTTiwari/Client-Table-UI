import React, { createContext, useState, useEffect } from 'react';
import { fetchClients, createClient } from '../api/clientApi';

export const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const addClient = async (newClient) => {
    try {
      const createdClient = await createClient(newClient);
      setClients(prev => [...prev, createdClient]);
      loadClients(); //
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        setClients,
        loading,
        error,
        filter,
        setFilter,
        addClient,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};