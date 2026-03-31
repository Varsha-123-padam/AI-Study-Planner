import { useState } from 'react';
import { Calendar, Clock, BookOpen, Sparkles, AlertCircle } from 'lucide-react';

interface StudyPlannerFormProps {
  onGeneratePlan: (subjects: string[], examDate: Date, dailyHours: number) => void;
  onReset: () => void;
  isGenerated: boolean;
}

export default function StudyPlannerForm({ onGeneratePlan, onReset, isGenerated }: StudyPlannerFormProps) {
  const [subjects, setSubjects] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!subjects.trim()) {
      setError('Please enter at least one subject');
      return;
    }

    if (!examDate) {
      setError('Please select an exam date');
      return;
    }

    const hours = parseFloat(dailyHours);
    if (!dailyHours || hours <= 0 || hours > 24) {
      setError('Please enter valid daily study hours (1-24)');
      return;
    }

    const subjectList = subjects
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (subjectList.length === 0) {
      setError('Please enter at least one valid subject');
      return;
    }

    const selectedDate = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setError('Exam date must be in the future');
      return;
    }

    onGeneratePlan(subjectList, selectedDate, hours);
  };

  const handleReset = () => {
    setSubjects('');
    setExamDate('');
    setDailyHours('');
    setError('');
    onReset();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl card-shadow p-8 w-full max-w-md">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl mb-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Create Schedule</h2>
        <p className="text-sm text-gray-500 mt-1">Set up your exam parameters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="subjects" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Subjects
          </label>
          <input
            type="text"
            id="subjects"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="Math, Physics, Chemistry"
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1.5">Separate with commas</p>
        </div>

        <div>
          <label htmlFor="examDate" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            Exam Date
          </label>
          <input
            type="date"
            id="examDate"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            min={today}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="dailyHours" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
            <Clock className="w-4 h-4 text-blue-600" />
            Daily Hours
          </label>
          <input
            type="number"
            id="dailyHours"
            value={dailyHours}
            onChange={(e) => setDailyHours(e.target.value)}
            placeholder="4"
            min="0.5"
            max="24"
            step="0.5"
            className="input-field"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate Plan
          </button>

          {isGenerated && (
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
