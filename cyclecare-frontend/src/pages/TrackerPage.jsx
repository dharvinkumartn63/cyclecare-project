import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Pencil, Trash2, CalendarDays } from 'lucide-react';
import { periodApi } from '../api/periodApi';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { ConfirmModal } from '../components/ui/Modal';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import AppLayout from '../components/layout/AppLayout';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const PeriodForm = ({ initial, onSave, onClose, loading }) => {
  const [form, setForm] = useState({
    startDate: initial?.startDate ? formatDate(initial.startDate, 'yyyy-MM-dd') : '',
    endDate: initial?.endDate ? formatDate(initial.endDate, 'yyyy-MM-dd') : '',
    notes: initial?.notes || '',
  });
  const [error, setError] = useState('');

  const getMaxEndDate = (startDateStr) => {
    if (!startDateStr) return undefined;
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + 6); // 7 days max inclusive
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate) { setError('Start date is required.'); return; }
    if (form.endDate) {
      if (form.endDate < form.startDate) {
        setError('End date cannot be before start date.');
        return;
      }
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 7) {
        setError('Period duration cannot exceed 7 days.');
        return;
      }
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-200 dark:border-red-800">{error}</p>}
      <div className="flex flex-col gap-1.5">
        <label className="label">Period Start Date <span className="text-primary-500">*</span></label>
        <input type="date" value={form.startDate}
          onChange={e => { setForm(p => ({ ...p, startDate: e.target.value })); setError(''); }} className="input-field" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="label">Period End Date <span className="text-xs text-gray-400 ml-1">(Optional, max 7 days)</span></label>
        <input type="date" value={form.endDate} min={form.startDate} max={getMaxEndDate(form.startDate)}
          onChange={e => { setForm(p => ({ ...p, endDate: e.target.value })); setError(''); }} className="input-field" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="label">Notes <span className="text-xs text-gray-400 ml-1">(Optional)</span></label>
        <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          placeholder="Any notes about this period..." rows={2} className="input-field resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Period</Button>
      </div>
    </form>
  );
};

const TrackerPage = () => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await periodApi.getPeriods();
      setPeriods(res.data.data.periods);
    } catch { toast.error('Failed to load periods.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPeriods(); }, [fetchPeriods]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editRecord) {
        await periodApi.updatePeriod(editRecord._id, form);
        toast.success('Period record updated.');
      } else {
        await periodApi.createPeriod(form);
        toast.success('Period record saved. 🌸');
      }
      setShowModal(false);
      setEditRecord(null);
      fetchPeriods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await periodApi.deletePeriod(deleteId);
      toast.success('Period record deleted.');
      setDeleteId(null);
      fetchPeriods();
    } catch { toast.error('Failed to delete record.'); }
    finally { setDeleting(false); }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Period Tracker</h1>
            <p className="text-muted">Log and manage your period records.</p>
          </div>
          <Button onClick={() => { setEditRecord(null); setShowModal(true); }}>
            <PlusCircle className="w-4 h-4" /> Add Period
          </Button>
        </div>

        {loading ? <PageLoader text="Loading period records..." /> :
          periods.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Your cycle history is empty."
              description="Start by adding your first period record. The more records you add, the better your predictions will be."
              actionLabel="Add Your First Period"
              onAction={() => { setEditRecord(null); setShowModal(true); }}
            />
          ) : (
            <div className="card overflow-hidden p-0">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {['Period Start', 'Period End', 'Duration', 'Actions'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {periods.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-800 dark:text-gray-100">{formatDate(p.startDate)}</td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{p.endDate ? formatDate(p.endDate) : <span className="text-amber-500 text-xs">Not set</span>}</td>
                        <td className="px-5 py-4">
                          {p.duration ? <span className="badge-primary">{p.duration} days</span> : <span className="text-gray-400 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditRecord(p); setShowModal(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors" aria-label="Edit period">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Delete period">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {periods.map((p) => (
                  <div key={p._id} className="p-4 flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{formatDate(p.startDate)}</p>
                      <p className="text-xs text-gray-400">to {p.endDate ? formatDate(p.endDate) : 'end not set'}</p>
                      {p.duration && <span className="badge-primary w-fit">{p.duration} days</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditRecord(p); setShowModal(true); }} className="p-1.5 rounded-lg text-gray-400 hover:text-secondary-500" aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {/* Add/Edit Modal */}
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditRecord(null); }} title={editRecord ? 'Edit Period Record' : 'Add New Period'}>
          <PeriodForm initial={editRecord} onSave={handleSave} onClose={() => { setShowModal(false); setEditRecord(null); }} loading={saving} />
        </Modal>

        {/* Delete Confirm */}
        <ConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Period Record"
          message="Are you sure you want to delete this period record? This action cannot be undone."
          confirmLabel="Delete"
          loading={deleting}
        />
      </div>
    </AppLayout>
  );
};

export default TrackerPage;
