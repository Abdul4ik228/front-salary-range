import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { ResumeForm, type ResumeData } from "./components/ResumeForm";
import { SalaryResult, type SalaryRange, type Recommendation } from "./components/SalaryResult";
import { Briefcase } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<"upload" | "form" | "result">("upload");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [salaryRange, setSalaryRange] = useState<SalaryRange | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const calculateSalary = (data: ResumeData): SalaryRange => {
    const baseMin = 80000;
    const baseMax = 250000;

    const experienceMultiplier = 1 + (parseInt(data.experience) * 0.15);
    const skillsMultiplier = 1 + (data.skills.length * 0.05);

    const cityMultipliers: Record<string, number> = {
      "Москва": 1.4,
      "Санкт-Петербург": 1.2,
      "москва": 1.4,
      "санкт-петербург": 1.2,
    };

    const cityMultiplier = cityMultipliers[data.city] || 1.0;

    const min = Math.round(baseMin * experienceMultiplier * cityMultiplier);
    const max = Math.round(baseMax * experienceMultiplier * skillsMultiplier * cityMultiplier);
    const median = Math.round((min + max) / 2);

    return { min, max, median };
  };

  const generateRecommendations = (data: ResumeData): Recommendation[] => {
    const recs: Recommendation[] = [];

    if (data.skills.length < 5) {
      recs.push({
        title: "Добавьте больше навыков",
        description: `У вас указано ${data.skills.length} навыка. Добавьте релевантные технологии и инструменты, которыми владеете. Рекомендуется указать минимум 5-7 ключевых навыков.`,
        impact: "high",
      });
    }

    if (parseInt(data.experience) < 3) {
      recs.push({
        title: "Детализируйте свой опыт",
        description: "Опишите конкретные проекты, над которыми работали, и достигнутые результаты. Укажите метрики и количественные показатели вашей работы.",
        impact: "high",
      });
    }

    if (!data.skills.some(s => s.toLowerCase().includes("react") || s.toLowerCase().includes("angular") || s.toLowerCase().includes("vue"))) {
      recs.push({
        title: "Укажите популярные фреймворки",
        description: "Добавьте современные фреймворки и библиотеки (React, Vue, Angular), если вы с ними работали. Это значительно повысит вашу привлекательность для работодателей.",
        impact: "medium",
      });
    }

    recs.push({
      title: "Добавьте сертификаты и курсы",
      description: "Укажите пройденные курсы, сертификации и участие в профессиональных мероприятиях. Это демонстрирует вашу мотивацию к развитию.",
      impact: "medium",
    });

    recs.push({
      title: "Опишите soft skills",
      description: "Добавьте информацию о навыках коммуникации, работы в команде, лидерства. Работодатели ценят не только технические, но и межличностные навыки.",
      impact: "low",
    });

    return recs;
  };

  const handleFileParsed = (data: ResumeData) => {
    setResumeData(data);
    setCurrentView("form");
  };

  const handleManualEntry = () => {
    setResumeData(null);
    setCurrentView("form");
  };

  const handleSubmit = (data: ResumeData) => {
    setResumeData(data);
    const salary = calculateSalary(data);
    const recs = generateRecommendations(data);

    setSalaryRange(salary);
    setRecommendations(recs);
    setCurrentView("result");
  };

  const handleRecalculate = () => {
    setCurrentView("form");
  };

  const handleBackToUpload = () => {
    setResumeData(null);
    setCurrentView("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="size-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Калькулятор зарплаты</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Узнайте свою рыночную стоимость и получите рекомендации по улучшению резюме
          </p>
        </header>

        <main className="flex items-center justify-center">
          {currentView === "upload" && (
            <FileUpload
              onParsed={handleFileParsed}
              onManualEntry={handleManualEntry}
            />
          )}
          {currentView === "form" && (
            <ResumeForm
              onSubmit={handleSubmit}
              initialData={resumeData || undefined}
              onBack={handleBackToUpload}
            />
          )}
          {currentView === "result" && resumeData && salaryRange && (
            <SalaryResult
              resumeData={resumeData}
              salaryRange={salaryRange}
              recommendations={recommendations}
              onRecalculate={handleRecalculate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
