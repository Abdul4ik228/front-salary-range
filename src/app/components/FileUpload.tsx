import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Upload, File, X, CheckCircle } from "lucide-react";
import type { ResumeData } from "./ResumeForm";

interface FileUploadProps {
  onParsed: (data: ResumeData) => void;
  onManualEntry: () => void;
}

export function FileUpload({ onParsed, onManualEntry }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const mockParseResume = async (file: File): Promise<ResumeData> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockData: ResumeData[] = [
      {
        name: "Алексей Петров",
        position: "Frontend Developer",
        experience: "4",
        skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Redux", "Next.js", "Git"],
        education: "Высшее техническое, МГТУ им. Баумана",
        city: "Москва",
      },
      {
        name: "Мария Иванова",
        position: "Full Stack Developer",
        experience: "6",
        skills: ["Node.js", "React", "PostgreSQL", "MongoDB", "Docker", "AWS", "TypeScript"],
        education: "Высшее техническое, СПбГУ",
        city: "Санкт-Петербург",
      },
      {
        name: "Дмитрий Сидоров",
        position: "Backend Developer",
        experience: "3",
        skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker"],
        education: "Высшее техническое, НГУ",
        city: "Новосибирск",
      },
    ];

    return mockData[Math.floor(Math.random() * mockData.length)];
  };

  const handleFileSelect = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx", "txt"];

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      alert("Пожалуйста, загрузите файл в формате PDF, DOC, DOCX или TXT");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const parsedData = await mockParseResume(file);
      onParsed(parsedData);
    } catch (error) {
      alert("Ошибка при обработке файла. Попробуйте еще раз.");
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="size-12 text-gray-400" />;
    return <File className="size-12 text-blue-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Загрузите резюме</CardTitle>
          <CardDescription>
            Поддерживаемые форматы: PDF, DOC, DOCX, TXT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              ${file ? "bg-green-50 border-green-500" : ""}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(",")}
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            {!file ? (
              <div className="space-y-4">
                {getFileIcon()}
                <div>
                  <p className="text-lg mb-2">
                    Перетащите файл сюда или нажмите для выбора
                  </p>
                  <p className="text-sm text-gray-500">
                    Максимальный размер: 10 MB
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Выбрать файл
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="size-12 text-green-600 mx-auto" />
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <File className="size-8 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      disabled={isProcessing}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Обработка резюме...
                    </>
                  ) : (
                    "Обработать резюме"
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-gray-600 mb-3">
              Или заполните резюме вручную
            </p>
            <Button
              variant="outline"
              onClick={onManualEntry}
              className="w-full"
            >
              Заполнить вручную
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium mb-2 text-blue-900">Как это работает?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Загрузите свое резюме в любом поддерживаемом формате</li>
          <li>• Система автоматически извлечет ключевую информацию</li>
          <li>• Вы сможете проверить и отредактировать данные перед расчетом</li>
          <li>• Получите вилку дохода и рекомендации по улучшению</li>
        </ul>
      </div>
    </div>
  );
}
