import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Gift } from '../types';
import Modal from '../components/Modal';

export default function AdminPage() {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [form, setForm] = useState({
        name: '',
        details: '',
        link: '',
        grade: 'common',
        reserved: false,
        imageFile: null as File | null,
    });

    const token = localStorage.getItem('token');

    const fetchGifts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/get_info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-ACCESS-TOKEN': token || ''
                },
            });
            if (!res.ok) throw new Error('Failed to load');
            const data = await res.json();
            setGifts(data.gifts);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const handleEditClick = (gift: Gift) => {
        setMode('edit');
        setCurrentId(gift.id);
        setForm({
            name: gift.name,
            details: gift.details || '',
            link: gift.link || '',
            grade: gift.grade,
            reserved: gift.reserved,
            imageFile: null,
        });
        setShowFormModal(true);
    };

    const handleAddClick = () => {
        setMode('add');
        setCurrentId(null);
        setForm({ name: '', details: '', link: '', grade: 'common', reserved: false, imageFile: null });
        setShowFormModal(true);
    };

    const handleDeleteClick = (gift: Gift) => {
        setSelectedGift(gift);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedGift) return;
        try {
            await fetch(`/api/gifts/${selectedGift.id}`, {
                method: 'DELETE',
                headers: { 'X-ACCESS-TOKEN': token || '' },
            });
            fetchGifts();
        } catch (e) {
            console.error('Failed to delete', e);
        } finally {
            setShowDeleteModal(false);
            setSelectedGift(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedGift(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, imageFile: e.target.files?.[0] || null }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('details', form.details);
        fd.append('link', form.link);
        fd.append('grade', form.grade);
        fd.append('reserved', String(form.reserved));
        if (form.imageFile) fd.append('image', form.imageFile);

        const url = mode === 'add' ? '/api/gifts/' : `/api/gifts/${currentId}`;
        const method = mode === 'add' ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'X-ACCESS-TOKEN': token || '' },
                body: fd,
            });
            if (!res.ok) throw new Error('Error saving');
            fetchGifts();
            setShowFormModal(false);
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return (
        <div className="app">
            <div className="app-loading">
                <img src="/assets/fire_ring.gif" alt="Loading" className="loader-gif" />
            </div>
        </div>
    );

    return (
        <div className="app" style={{ transition: 'opacity 0.5s ease-in-out' }}>
            <div className='gift-manager'>
                <h1>Управление подарками</h1>
                <div className='gift-list'>
                    {gifts.map(g => (
                        <div className='gift-list-item' key={g.id}>
                            <span className='gift-list-item-name'>{g.name}</span>
                            <div className='actions'>
                                <div className="modal-button" role="button" onClick={() => handleEditClick(g)}>✎</div>
                                <div className="modal-button" role="button" onClick={() => handleDeleteClick(g)}>྾</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-button" role="button" onClick={handleAddClick}>Добавить</div>
            </div>

            {showFormModal && (
                <div className="admin-modal modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{mode === 'add' ? 'Добавить' : 'Редактировать'}</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='form-groups'>
                                <div className="form-group">
                                    <label>Имя:</label>
                                    <input name="name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Детали:</label>
                                    <textarea name="details" value={form.details} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Ссылка:</label>
                                    <input name="link" value={form.link} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Грейд:</label>
                                    <select name="grade" value={form.grade} onChange={handleChange}>
                                        <option value="common">common</option>
                                        <option value="rare">rare</option>
                                        <option value="epic">epic</option>
                                        <option value="legendary">legendary</option>
                                    </select>
                                </div>
                                <div className="form-group checkbox-group">
                                    <label>Забонирован:</label>
                                    <input
                                        type="checkbox"
                                        name="reserved"
                                        checked={form.reserved}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Картинка:</label>
                                    <input type="file" accept="image/*" onChange={handleFile} style={{ fontSize: "11px" }} />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <div className="form-button" role="button" onClick={() => setShowFormModal(false)}>
                                    Отмена
                                </div>
                                <div className="form-button" role="button" onClick={handleSubmit} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
                                    {mode === 'add' ? 'Добавить' : 'Сохранить'}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteModal && selectedGift && (
                <Modal
                    selectedGift={selectedGift}
                    message="Вы уверены, что хотите удалить этот подарок?"
                    confirmText="Да"
                    showCancel={true}
                    onConfirmReservation={confirmDelete}
                    onCancelReservation={cancelDelete}
                />
            )}
        </div>
    );
}
