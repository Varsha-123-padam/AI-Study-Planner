import { useState } from 'react';
import StudyPlannerForm from './components/StudyPlannerForm';
import StudyPlanDisplay from './components/StudyPlanDisplay';
import { generateStudyPlan, getMotivationalQuote, DayPlan } from './utils/planGenerator';

function App() {
  const [studyPlan, setStudyPlan] = useState<DayPlan[] | null>(null);
  const [quote, setQuote] = useState<string>('');

  const handleGeneratePlan = (subjects: string[], examDate: Date, dailyHours: number) => {
    try {
      const plan = generateStudyPlan(subjects, examDate, dailyHours);
      const motivationalQuote = getMotivationalQuote();
      setStudyPlan(plan);
      setQuote(motivationalQuote);
    } catch (error) {
      console.error('Error generating plan:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate study plan');
    }
  };

  const handleReset = () => {
    setStudyPlan(null);
    setQuote('');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H2.5A1.5 1.5 0 001 3v14a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V9.5M10.5 1.5v6M10.5 1.5L19 10" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Study Planner</h1>
              <p className="text-sm text-gray-500">Master your exam preparation with intelligent scheduling</p>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen pb-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {!studyPlan ? (
            <div className="flex justify-center">
              <StudyPlannerForm
                onGeneratePlan={handleGeneratePlan}
                onReset={handleReset}
                isGenerated={false}
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-2/5 w-full">
                  <StudyPlannerForm
                    onGeneratePlan={handleGeneratePlan}
                    onReset={handleReset}
                    isGenerated={true}
                  />
                </div>
                <div className="lg:w-3/5 w-full">
                  <StudyPlanDisplay plan={studyPlan} quote={quote} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
