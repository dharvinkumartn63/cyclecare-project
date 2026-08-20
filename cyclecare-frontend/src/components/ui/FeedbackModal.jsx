import { useState } from 'react';
import { Send, AlertCircle, MessageSquare, CheckCircle2, Mail } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import toast from 'react-hot-toast';

const ISSUE_CATEGORIES = [
  'Bug / Application Error',
  'Cycle Tracker & Dates Issue',
  'Prediction Calculation Issue',
  'Hydration Tracker Problem',
  'Feature Suggestion',
  'Account & Login Issue',
  'Other Issue',
];

const FeedbackModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [issueType, setIssueType] = useState('Bug / Application Error');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter details about your issue.');
      return;
    }

    setLoading(true);
    try {
      await userApi.submitFeedback({
        issueType,
        message,
        email: email || user?.email || 'N/A',
      });
      setSubmitted(true);
      toast.success('Feedback submitted! Opening mail client to dharvin558@gmail.com');
    } catch (_) {
      toast.error('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="💬 Report Issue & Feedback">
      {submitted ? (
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Feedback Submitted!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm">
            Thank you for helping us improve CycleCare! Your report has been prepared for <span className="font-semibold text-primary-600 dark:text-primary-400">dharvin558@gmail.com</span> with subject <span className="font-bold">"carecycle issue"</span>.
          </p>
          <Button onClick={handleReset} className="mt-2">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          {/* Recipient Notice Banner */}
          <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl text-xs text-primary-800 dark:text-primary-300">
            <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <div>
              <p className="font-semibold">Direct Email Support:</p>
              <p>Sent to <span className="font-bold">dharvin558@gmail.com</span> with subject <span className="font-bold">"carecycle issue"</span>.</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label">Issue Category <span className="text-primary-500">*</span></label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="input-field cursor-pointer"
            >
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            label="Your Email (for response)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="label">Describe the Issue / Feedback <span className="text-primary-500">*</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what went wrong or what you'd like us to improve..."
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="gap-2">
              <Send className="w-4 h-4" /> Submit Issue Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default FeedbackModal;
