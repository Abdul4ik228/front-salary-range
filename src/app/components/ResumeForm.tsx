import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Plus, ArrowLeft } from "lucide-react";

export interface ResumeData {
  name: string;
  position: string;
  experience: string;
  skills: string[];
  education: string;
  city: string;
}

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => void | Promise<void>;
  initialData?: ResumeData;
  onBack?: () => void;
}

export function ResumeForm({ onSubmit, initialData, onBack }: ResumeFormProps) {
  const [formData, setFormData] = useState<ResumeData>(
    initialData || {
      name: "",
      position: "",
      experience: "",
      skills: [],
      education: "",
      city: "",
    }
  );

  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <div className="flex-1">
            <CardTitle>{initialData ? "Проверьте данные" : "Заполните резюме"}</CardTitle>
            <CardDescription>
              {initialData
                ? "Данные извлечены из вашего резюме. Вы можете их отредактировать."
                : "Введите свои данные, чтобы узнать вилку вашего потенциального дохода"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Должность</Label>
            <Input
              id="position"
              placeholder="Frontend Developer"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Опыт работы (лет)</Label>
              <Input
                id="experience"
                type="number"
                placeholder="3"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                placeholder="Москва"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Образование</Label>
            <Input
              id="education"
              placeholder="Высшее техническое"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Навыки</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="React, TypeScript, Node.js..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSkill}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="default" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full hover:bg-blue-200"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Загрузка..." : "Рассчитать вилку дохода"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
