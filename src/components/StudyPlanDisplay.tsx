import { DayPlan } from '../utils/planGenerator';
import { Calendar, Clock, BookOpen, Zap, CheckCircle2 } from 'lucide-react';

interface StudyPlanDisplayProps {
  plan: DayPlan[];
  quote: string;
}

export default function StudyPlanDisplay({ plan, quote }: StudyPlanDisplayProps) {
  const totalDays = plan.length;
  const totalHours = plan.reduce((sum, day) => sum + day.totalHours, 0);
  const subjects = Array.from(new Set(plan.flatMap(day => day.blocks.map(b => b.subject))));

  const subjectColors: Record<string, { bg: string; text: string; badge: string }> = {};
  const colorSchemes = [
    { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
    { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
    { bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700 border-rose-200' },
    { bg: 'bg-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', badge: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
    { bg: 'bg-lime-50', text: 'text-lime-700', badge: 'bg-lime-100 text-lime-700 border-lime-200' },
    { bg: 'bg-indigo-50', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  ];

  subjects.forEach((subject, index) => {
    subjectColors[subject] = colorSchemes[index % colorSchemes.length];
  });

  return (
    <div className="w-full space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl card-shadow p-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full opacity-10 -mr-20 -mt-20"></div>
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Your Motivation</p>
              <p className="text-lg italic font-light leading-relaxed">"{quote}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow p-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Study Plan Generated</h2>
              <p className="text-gray-600 text-sm mt-1">Your personalized learning schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Days</p>
              <p className="text-3xl font-bold text-blue-700">{totalDays}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-emerald-700">{totalHours}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Subjects</p>
              <p className="text-3xl font-bold text-amber-700">{subjects.length}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Subject Focus Areas</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map(subject => (
                <span
                  key={subject}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${subjectColors[subject].badge}`}
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Daily Schedule
          </p>

          <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
            {plan.map((dayPlan) => (
              <div
                key={dayPlan.day}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                      <span className="text-sm font-bold text-blue-600">D{dayPlan.day}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dayPlan.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">{dayPlan.totalHours}h</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {dayPlan.blocks.map((block, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 rounded-lg p-3 border border-gray-100 transition-colors ${subjectColors[block.subject].bg}`}
                    >
                      <BookOpen className={`w-4 h-4 flex-shrink-0 ${subjectColors[block.subject].text}`} />
                      <span className={`flex-1 text-sm font-medium ${subjectColors[block.subject].text}`}>
                        {block.subject}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${subjectColors[block.subject].badge}`}>
                        {block.hours}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
