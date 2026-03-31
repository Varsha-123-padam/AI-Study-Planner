export interface StudyBlock {
  subject: string;
  hours: number;
}

export interface DayPlan {
  day: number;
  date: string;
  blocks: StudyBlock[];
  totalHours: number;
}

export function generateStudyPlan(
  subjects: string[],
  examDate: Date,
  dailyHours: number
): DayPlan[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDateTime = new Date(examDate);
  examDateTime.setHours(0, 0, 0, 0);

  const daysUntilExam = Math.ceil((examDateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExam <= 0) {
    throw new Error("Exam date must be in the future");
  }

  const totalHours = daysUntilExam * dailyHours;
  const subjectCount = subjects.length;

  const baseHoursPerSubject = totalHours / subjectCount;
  const subjectAllocations = subjects.map(subject => ({
    subject,
    totalHours: baseHoursPerSubject,
    remainingHours: baseHoursPerSubject
  }));

  const plan: DayPlan[] = [];

  for (let day = 0; day < daysUntilExam; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);

    const dayBlocks: StudyBlock[] = [];
    let hoursAllocated = 0;

    const dayProgress = day / daysUntilExam;

    for (let i = 0; i < subjectCount && hoursAllocated < dailyHours; i++) {
      const subjectIndex = (day + i) % subjectCount;
      const allocation = subjectAllocations[subjectIndex];

      if (allocation.remainingHours > 0) {
        const baseBlockHours = dailyHours / subjectCount;
        let blockHours = Math.min(
          baseBlockHours,
          allocation.remainingHours,
          dailyHours - hoursAllocated
        );

        if (dayProgress > 0.7) {
          const priorityBoost = allocation.remainingHours / allocation.totalHours;
          blockHours = Math.min(
            blockHours * (1 + priorityBoost * 0.5),
            allocation.remainingHours,
            dailyHours - hoursAllocated
          );
        }

        blockHours = Math.round(blockHours * 10) / 10;

        if (blockHours > 0) {
          dayBlocks.push({
            subject: allocation.subject,
            hours: blockHours
          });

          allocation.remainingHours -= blockHours;
          hoursAllocated += blockHours;
        }
      }
    }

    if (hoursAllocated < dailyHours && hoursAllocated > 0) {
      const diff = dailyHours - hoursAllocated;
      const availableSubjects = subjectAllocations.filter(a => a.remainingHours > 0);

      if (availableSubjects.length > 0 && dayBlocks.length > 0) {
        const lastBlock = dayBlocks[dayBlocks.length - 1];
        const additionalHours = Math.min(diff,
          subjectAllocations.find(a => a.subject === lastBlock.subject)?.remainingHours || 0
        );

        if (additionalHours > 0) {
          lastBlock.hours = Math.round((lastBlock.hours + additionalHours) * 10) / 10;
          const allocation = subjectAllocations.find(a => a.subject === lastBlock.subject);
          if (allocation) {
            allocation.remainingHours -= additionalHours;
          }
          hoursAllocated += additionalHours;
        }
      }
    }

    plan.push({
      day: day + 1,
      date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      blocks: dayBlocks,
      totalHours: Math.round(hoursAllocated * 10) / 10
    });
  }

  return plan;
}

export function getMotivationalQuote(): string {
  const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Study while others are sleeping; work while others are loafing.",
    "Your future is created by what you do today, not tomorrow.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "Focus on being productive instead of busy.",
    "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    "Dream big, start small, but most of all, start.",
    "The only way to do great work is to love what you do."
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}
