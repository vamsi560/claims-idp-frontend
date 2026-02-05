
import React, { useEffect, useState } from 'react';

import FNOLList from './components/FNOLList';
import FNOLEdit from './components/FNOLEdit';
import { fetchFNOLs } from './api';

function App() {

  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    async function loadFNOLs() {
      try {
        const data = await fetchFNOLs();
        setWorkItems(data);
      } catch (err) {
        setError('Failed to load FNOL work items');
      } finally {
        setLoading(false);
      }
    }
    loadFNOLs();
  }, []);

  return (
    <div>
      <h1>FNOL Workbench</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && !editingItem && (
        <FNOLList workItems={workItems} onEdit={setEditingItem} />
      )}
      {editingItem && (
        <FNOLEdit workItem={editingItem} onBack={() => setEditingItem(null)} />
      )}
    </div>
  );
}

export default App;
