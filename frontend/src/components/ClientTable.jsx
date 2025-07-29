import React, { useContext, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ClientsContext } from '../context/ClientContext';
import { PlusIcon, XMarkIcon, ArrowPathIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import ClientFilters from './ClientFilters';
import SortPanel from './SortPanel';
import SortableClientRow from './SortableClientRow';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

const ClientTable = () => {
  const { clients, loading, error, filter, setClients, addClient } = useContext(ClientsContext);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    clientName: '', 
    clientType: 'individual', 
    email: '' 
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const filteredClients = filter === 'all' 
    ? clients 
    : clients.filter(client => client.clientType === filter);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setClients((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    if (!form.clientName || !form.email) {
      setFormError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      await addClient(form);
      setForm({ clientName: '', clientType: 'individual', email: '' });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || 'Failed to add client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeClient = activeId ? clients.find(client => client.id === activeId) : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <h2 className="text-lg font-semibold text-gray-800">Client Management</h2>
        <div className="flex items-center space-x-4">
          <ClientFilters />
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showForm 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showForm ? (
              <>
                <XMarkIcon className="h-4 w-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                <span>Add Client</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sort Panel */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <SortPanel />
      </div>

      {/* Add Client Form */}
      {showForm && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  placeholder="John Doe"
                  value={form.clientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Type
                </label>
                <select
                  name="clientType"
                  value={form.clientType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>
            
            {formError && (
              <div className="text-red-600 text-sm flex items-center">
                <XMarkIcon className="h-4 w-4 mr-1" />
                {formError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Add Client'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Client Table with DnD */}
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="sr-only">Drag Handle</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <SortableContext
                items={clients.map(client => client.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredClients.map((client) => (
                  <SortableClientRow key={client.id} id={client.id} client={client} />
                ))}
              </SortableContext>
            </tbody>
          </table>
          <DragOverlay>
            {activeClient ? (
              <table className="min-w-full">
                <tbody>
                  <tr className="bg-blue-50 shadow-lg">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activeClient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activeClient.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {activeClient.clientType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activeClient.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activeClient.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {filteredClients.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No clients found. {filter !== 'all' && 'Try changing your filter.'}
        </div>
      )}
    </div>
  );
};

export default ClientTable;