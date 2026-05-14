import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { ResumeForm, type ResumeData } from "./components/ResumeForm";
import { SalaryResult, type SalaryRange, type Recommendation } from "./components/SalaryResult";
import { Briefcase } from "lucide-react";
import { calculateSalary as callCalculateSalaryAPI } from "./lib/api";

export default function App() {
  const [currentView, setCurrentView] = useState<"upload" | "form" | "result">("upload");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [salaryRange, setSalaryRange] = useState<SalaryRange | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const calculateSalary = async (data: ResumeData): Promise<{ salary: SalaryRange; recs: Recommendation[] }> => {
    try {
      // Преобразуем ResumeData в формат для API
      const apiRequest = {
        role: data.position,
        experience_year: parseInt(data.experience),
        skills: data.skills,
        region: data.city,
        education: data.education,
      };

      // Вызываем API
      const apiResponse = await callCalculateSalaryAPI(apiRequest);

      // Преобразуем ответ API в SalaryRange
      const salary: SalaryRange = {
        min: apiResponse.min_salary,
        max: apiResponse.max_salary,
        median: Math.round((apiResponse.min_salary + apiResponse.max_salary) / 2),
      };

      // Преобразуем рекомендации из API
      const recs: Recommendation[] = apiResponse.recommendations.map((rec, index) => ({
        title: rec.split(":")[0] || `Рекомендация ${index + 1}`,
        description: rec,
        impact: index === 0 ? "high" : index === 1 ? "medium" : "low",
      }));

      return { salary, recs };
    } catch (error) {
      console.error("Ошибка при расчёте зарплаты:", error);
      throw error;
    }
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

  const handleSubmit = async (data: ResumeData) => {
    setResumeData(data);
    try {
      const { salary, recs } = await calculateSalary(data);
      setSalaryRange(salary);
      setRecommendations(recs);
      setCurrentView("result");
    } catch (error) {
      alert(
        `Ошибка при расчёте зарплаты: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`
      );
    }
  };

  const handleRecalculate = () => {
    setCurrentView("form");
  };

  const handleBackToUpload = () => {
    setResumeData(null);
    setCurrentView("upload");
  };

  return (
    <div className="min-h-screen bg-[#1d4ed8] text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="size-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Калькулятор зарплаты</h1>
          </div>
          <p className="text-lg text-white max-w-2xl mx-auto">
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
