// API клиент для общения с бэкендом
const API_BASE_URL = "http://localhost:8000/api";

export interface ParseResumeResponse {
  role: string;
  experience_year: number;
  skills: string[];
  region: string;
  education: string;
}

export interface CalculateSalaryResponse {
  min_salary: number;
  max_salary: number;
  recommendations: string[];
}

/**
 * Загрузить файл резюме и распарсить его на бэкенде
 */
export async function parseResume(file: File): Promise<ParseResumeResponse> {
  const formData = new FormData();
  formData.append("resume", file);

  console.log("📤 Отправляю резюме на бэкенд:", file.name);

  try {
    const response = await fetch(`${API_BASE_URL}/parse_resume/`, {
      method: "POST",
      body: formData,
    });

    console.log("📥 Ответ от /parse_resume/:", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Ошибка парсинга:", errorData);
      throw new Error(`Ошибка при парсинге резюме: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Успешно распарсено:", data);
    return data;
  } catch (error) {
    console.error("❌ Ошибка сети при parseResume:", error);
    throw error;
  }
}

/**
 * Отправить данные резюме и получить расчёт зарплаты
 */
export async function calculateSalary(resumeData: {
  role: string;
  experience_year: number;
  skills: string[];
  region: string;
  education: string;
}): Promise<CalculateSalaryResponse> {
  console.log("📤 Отправляю на расчёт зарплаты:", resumeData);

  try {
    const response = await fetch(`${API_BASE_URL}/calculate_salary/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    console.log("📥 Ответ от /calculate_salary/:", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Ошибка расчёта:", errorData);
      throw new Error(`Ошибка при расчёте зарплаты: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Успешно рассчитано:", data);
    return data;
  } catch (error) {
    console.error("❌ Ошибка сети при calculateSalary:", error);
    throw error;
  }
}
