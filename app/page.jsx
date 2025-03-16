'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { PlusCircle, Trash2, Edit, Eye, X, Check } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [selectedCard, setSelectedCard] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    imagePath: '',
    description: '',
    choices: [{ text: '', statChanges: [0, 0, 0, 0] }, { text: '', statChanges: [0, 0, 0, 0] }],
    addon: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Not logged in");
        return;
    }

    fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
                localStorage.removeItem("token");
            } else {
                setUser(data);
            }
        });
  }, []);

  useEffect(() => {
      fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cards');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      
      const data = await response.json();
      setCards(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create card');
      }
  
      const newCard = await response.json();
      setCards([...cards, newCard]);
      resetForm();
      setViewMode('list');
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleUpdateCard = async () => {
    try {
      const response = await fetch(`/api/cards/${selectedCard._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update card');
      }
  
      const updatedCard = await response.json();
      const updatedCards = cards.map(card => 
        card._id === selectedCard._id ? updatedCard : card
      );
      
      setCards(updatedCards);
      resetForm();
      setViewMode('list');
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete card');
      }
  
      const updatedCards = cards.filter(card => card._id !== id);
      setCards(updatedCards);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };
  

  const fetchCardDetails = async (id) => {
    try {
      const response = await fetch(`/api/cards/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch card details');
      }
      
      const cardData = await response.json();
      return cardData;
    } catch (error) {
      console.error('Error fetching card details:', error);
      return null;
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imagePath: '',
      description: '',
      choices: [{ text: '', statChanges: [0, 0, 0, 0] }],
      addon: ''
    });
    setSelectedCard(null);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setFormData({
      title: card.title,
      imagePath: card.imagePath,
      description: card.description,
      choices: [...card.choices],
      addon: card.addon || ''
    });
    setViewMode('edit');
  };

  const handleViewCard = (card) => {
    setSelectedCard(card);
    setViewMode('view');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChoiceChange = (index, field, value) => {
    const updatedChoices = [...formData.choices];
    updatedChoices[index] = { ...updatedChoices[index], [field]: value };
    setFormData({ ...formData, choices: updatedChoices });
  };

  const handleStatChange = (choiceIndex, statIndex, value) => {
    const updatedChoices = [...formData.choices];
    const updatedStats = [...updatedChoices[choiceIndex].statChanges];
    updatedStats[statIndex] = parseInt(value) || 0;
    updatedChoices[choiceIndex] = { 
      ...updatedChoices[choiceIndex], 
      statChanges: updatedStats 
    };
    setFormData({ ...formData, choices: updatedChoices });
  };

  const addChoice = () => {
    if (formData.choices.length < 2) {
      setFormData({
        ...formData,
        choices: [...formData.choices, { text: '', statChanges: [0, 0, 0, 0] }]
      });
    }
  };
  
  const removeChoice = (index) => {
    if (formData.choices.length > 1) {
      const updatedChoices = formData.choices.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        choices: updatedChoices
      });
    }
  };

  const renderCardList = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card._id} className="bg-gray-800 flex flex-col rounded-lg overflow-hidden shadow-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex-grow">
              <h3 className="text-xl font-bold text-gray-100 mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{card.addon || 'No Addon'}</p>
              <p className="text-gray-300 text-sm">{card.description.substring(0, 100)}...</p>
            </div>
            <div className="bg-gray-900 px-4 py-3 flex justify-end space-x-2">
              <button
                onClick={() => handleViewCard(card)}
                className="p-1 rounded-full hover:bg-gray-700 text-blue-400"
                title="View"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleEditCard(card)}
                className="p-1 rounded-full hover:bg-gray-700 text-amber-400"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeleteCard(card._id)}
                className="p-1 rounded-full hover:bg-gray-700 text-red-400"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCardForm = (isEdit = false) => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">
          {isEdit ? 'Edit Card' : 'Create New Card'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-300 mb-2">Card Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Image Path</label>
            <input
              type="text"
              name="imagePath"
              value={formData.imagePath}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Addon</label>
          <input
            type="text"
            name="addon"
            value={formData.addon}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-200">Choices</h3>
            <button
              type="button"
              onClick={addChoice}
              disabled={formData.choices.length >= 2}
              className="px-2 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded flex items-center"
            >
              <PlusCircle size={18} className="mr-1" /> Add Choice
            </button>
          </div>
          
          {formData.choices.map((choice, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex justify-between mb-2">
                <h4 className="text-gray-200 font-medium">Choice {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeChoice(index)}
                  disabled={formData.choices.length <= 1}
                  className="px-2 py-1 bg-red-700 hover:bg-red-800 text-white rounded flex items-center"
                >
                  <Trash2 size={18} className="mr-1" /> Remove Choice
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 text-sm">Choice Text</label>
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Stat Changes</label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Food</label>
                    <input
                      type="number"
                      value={choice.statChanges[0]}
                      onChange={(e) => handleStatChange(index, 0, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Drink</label>
                    <input
                      type="number"
                      value={choice.statChanges[1]}
                      onChange={(e) => handleStatChange(index, 1, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Mental Health</label>
                    <input
                      type="number"
                      value={choice.statChanges[2]}
                      onChange={(e) => handleStatChange(index, 2, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Health</label>
                    <input
                      type="number"
                      value={choice.statChanges[3]}
                      onChange={(e) => handleStatChange(index, 3, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setViewMode('list');
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center"
          >
            <X size={18} className="mr-1" /> Cancel
          </button>
          <button
            type="button"
            onClick={isEdit ? handleUpdateCard : handleCreateCard}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded flex items-center"
          >
            <Check size={18} className="mr-1" /> {isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    );
  };

  const renderCardDetail = () => {
    if (!selectedCard) return null;
    
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">{selectedCard.title}</h2>
              {selectedCard.addon && (
                <span className="inline-block bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs mt-2">
                  {selectedCard.addon}
                </span>
              )}
            </div>
            <button
              onClick={() => setViewMode('list')}
              className="p-1 rounded-full hover:bg-gray-700 text-gray-400"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mt-4 mb-6">
            <div className="bg-gray-700 rounded p-4 text-gray-300">
              {selectedCard.description}
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Choices</h3>
          <div className="space-y-4">
            {selectedCard.choices.map((choice, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="font-medium text-white mb-2">{choice.text}</div>

                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${choice.statChanges[0] > 0 ? 'text-green-400' : choice.statChanges[0] < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {choice.statChanges[0] > 0 ? '+' : ''}{choice.statChanges[0]}
                    </div>
                    <div className="text-xs text-gray-400">Food</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${choice.statChanges[1] > 0 ? 'text-green-400' : choice.statChanges[1] < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {choice.statChanges[1] > 0 ? '+' : ''}{choice.statChanges[1]}
                    </div>
                    <div className="text-xs text-gray-400">Drink</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${choice.statChanges[2] > 0 ? 'text-green-400' : choice.statChanges[2] < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {choice.statChanges[2] > 0 ? '+' : ''}{choice.statChanges[2]}
                    </div>
                    <div className="text-xs text-gray-400">Mental Health</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${choice.statChanges[3] > 0 ? 'text-green-400' : choice.statChanges[3] < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {choice.statChanges[3] > 0 ? '+' : ''}{choice.statChanges[3]}
                    </div>
                    <div className="text-xs text-gray-400">Health</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 px-6 py-4 flex justify-between">
          <button
            onClick={() => setViewMode('list')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Back to List
          </button>
          <button
            onClick={() => handleEditCard(selectedCard)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded flex items-center"
          >
            <Edit size={18} className="mr-1" /> Edit Card
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-300">
      <Head>
        <title>Dominion Admin</title>
        <meta name="description" content="Manage your Dominion card game" />
      </Head>

      <nav className="bg-gray-800 border-b border-gray-700 shadow-md">
  <div className="container mx-auto px-4 py-4">
    <div className="flex justify-between items-center">
      <h1
        className="text-2xl font-bold text-blue-500 cursor-pointer"
        onClick={() => setViewMode("list")}
      >
        Dominion Admin
      </h1>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="text-gray-400 text-sm">
              Logged in as <span className="font-semibold text-gray-200">{user?.email || 'User'}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="py-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            className="py-1 px-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
            type="button"
          >
            <a href="/auth/login">Login</a>
          </button>
        )}
      </div>
    </div>
  </div>
</nav>


      <main className="container mx-auto px-4 py-8 flex-grow">
        {viewMode === 'list' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-100">Card Library</h2>
              <button
                onClick={() => setViewMode('create')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <PlusCircle size={18} className="mr-2" /> New Card
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-400">Loading cards...</div>
              </div>
            ) : cards.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <h3 className="text-xl text-gray-300 mb-4">No cards found</h3>
                <p className="text-gray-400 mb-6">Create your first card to get started.</p>
                <button
                  onClick={() => setViewMode('create')}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg inline-flex items-center"
                >
                  <PlusCircle size={18} className="mr-2" /> Create Card
                </button>
              </div>
            ) : (
              renderCardList()
            )}
          </>
        )}

        {viewMode === 'create' && renderCardForm(false)}
        {viewMode === 'edit' && renderCardForm(true)}
        {viewMode === 'view' && renderCardDetail()}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            Dominion Card Dashboard &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}