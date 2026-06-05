import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Award,
  Play,
  Clock,
  ListChecks,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";

type LessonType = "content" | "video" | "quiz";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

interface Step {
  num: number;
  title: string;
  desc: string;
}

interface LessonData {
  id: number;
  type: LessonType;
  title: string;
  duration: string;
  description: string;
  keyPoints?: string[];
  noteText?: string;
  steps?: Step[];
  questions?: QuizQuestion[];
  videoUrl?: string;
}

const lessons: LessonData[] = [
  {
    id: 1,
    type: "content",
    title: "Core Material",
    duration: "10 minutes",
    videoUrl: "a2ZSGCeaL4U",
    description:
      "A mask, or 'topeng' in Indonesian, is an important part of Indonesia's cultural heritage. In this lesson, you will learn about the definition of masks, their historical background, their functions in society, and several traditional masks found across Indonesia.",
    keyPoints: [
      "Definition of a topeng (mask) in Indonesian culture",
      "Brief history of masks in traditional Indonesian communities",
      "Functions of masks in performances, ceremonies, and cultural preservation",
      "Examples of traditional masks such as Balinese, Cirebon, and Malang masks",
      "Essential Indonesian vocabulary related to masks and performing arts",
    ],
    noteText:
      "Different regions of Indonesia have unique mask designs, colors, and characters. These differences reflect the rich cultural diversity of the Indonesian people.",
  },

  // Tutorial & Langkah - Langkah

  {
    id: 2,
    type: "video",
    title: "Video Tutorial",
    duration: "8 minutes",
    videoUrl: "a2ZSGCeaL4U", // Ditambahkan agar video tutorial juga memiliki link
    description:
      "Follow these learning steps to better understand the topic of Indonesian traditional masks. Watch the video carefully and complete each stage before taking the evaluation quiz.",
    steps: [
      {
        num: 1,
        title: "Compiling Cultural Idea Mind-Maps",
        desc: " Learners brainstorm mask concepts by mapping a central emotion with supporting vocabulary on a mind-map.",
      },
      {
        num: 2,
        title: "Drawing Basic Facial Anatomy Sketches",
        desc: "Sketch the basic oval face silhouette and proportion lines for eyes, nose, and lips using a pencil",
      },
      {
        num: 3,
        title: "Manipulating Emotional Expression Lines",
        desc: "Detail facial features, like eyebrows, ornaments and mouth, to create specific emotional expressions",
      },
      {
        num: 4,
        title: "Cutting Out the Cardboard Board Silhouette",
        desc: "Carefully cut the thick cardboard following the outline of the sketch to create the flat base shape of the mask.",
      },
      {
        num: 5,
        title: "Applying Symbolic Coloring with Poster Paint",
        desc: "Apply paint colors that represent specific cultural traits and emotions as a base and detail coat",
      },
    ],
  },

  // Evaluasi

  {
    id: 3,
    type: "quiz",
    title: "Evaluation",
    duration: "5 minutes",
    description:
      "Test your understanding of the Indonesian language with the following evaluation questions. Answer each question carefully based on the material that has been studied.",
    questions: [
      {
        question: 'What is the meaning of the word "topeng" in English?',
        options: ["Mask", "Hat", "Costume", "Painting"],
        answer: 0,
      },
      {
        question: "What is one function of a traditional Indonesian mask?",
        options: [
          "Transportation",
          "Cooking",
          "Traditional performances",
          "Construction",
        ],
        answer: 2,
      },
      {
        question: "Where does the Balinese mask tradition come from?",
        options: ["Bali", "Jakarta", "Papua", "Aceh"],
        answer: 0,
      },
      {
        question: 'Which Indonesian word means "history"?',
        options: ["Function", "Culture", "History", "Type"],
        answer: 2,
      },
      {
        question: "Why are masks important in Indonesian culture?",
        options: [
          "They preserve cultural traditions",
          "They are used as money",
          "They are modern technology",
          "They are transportation tools",
        ],
        answer: 0,
      },
    ],
  },
];

const lessonIcon = (type: LessonType) => {
  if (type === "content") return BookOpen;
  if (type === "video") return Play;
  return ClipboardCheck;
};

interface Props {
  onNavigateToGame: () => void;
}

export function LearningModule({ onNavigateToGame }: Props) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [direction, setDirection] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedNote, setExpandedNote] = useState(false);

  const progress = (completedLessons.length / lessons.length) * 100;
  const lesson = lessons[currentLesson];

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      setDirection(1);
      setCurrentLesson(currentLesson + 1);
      setQuizSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setDirection(-1);
      setCurrentLesson(currentLesson - 1);
      setQuizSubmitted(false);
    }
  };

  const handleComplete = () => {
    if (!completedLessons.includes(currentLesson)) {
      setCompletedLessons([...completedLessons, currentLesson]);
    }
    if (currentLesson < lessons.length - 1) handleNext();
  };

  const handleLessonClick = (index: number) => {
    setDirection(index > currentLesson ? 1 : -1);
    setCurrentLesson(index);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (
      lesson.questions &&
      Object.keys(selectedAnswers).length === lesson.questions.length
    ) {
      setQuizSubmitted(true);
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson]);
      }
    }
  };

  const quizScore =
    quizSubmitted && lesson.questions
      ? lesson.questions.filter((q, i) => selectedAnswers[i] === q.answer)
          .length
      : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
      },
    },
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
              className="p-3 bg-indigo-600 rounded-2xl shadow-lg"
            >
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                BIPA
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Bahasa Indonesia untuk Penutur Asing
              </p>
            </div>
          </div>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Learning Progress
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {completedLessons.length}/{lessons.length} Done
            </span>
          </div>
          <Progress value={progress} className="h-2 md:h-3" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Sidebar */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 flex flex-col gap-4"
          >
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Course List</CardTitle>
                <CardDescription>Select a list to start</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((ls, index) => {
                    const Icon = lessonIcon(ls.type);
                    const isActive = currentLesson === index;
                    const isDone = completedLessons.includes(index);
                    return (
                      <motion.button
                        key={ls.id}
                        onClick={() => handleLessonClick(index)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-3 md:p-4 rounded-xl text-left transition-all ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-lg"
                            : isDone
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle
                                className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon
                                className={`w-3.5 h-3.5 ${isActive ? "text-white/80" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-xs flex items-center gap-1 ${
                                  isActive ? "text-white/80" : "text-gray-500"
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                {ls.duration}
                              </span>
                            </div>
                            <p
                              className={`font-medium text-sm md:text-base ${
                                isActive
                                  ? "text-white"
                                  : isDone
                                    ? "text-green-900"
                                    : "text-gray-700"
                              }`}
                            >
                              {ls.title}
                            </p>
                            <p
                              className={`text-xs mt-0.5 line-clamp-2 ${
                                isActive ? "text-white/70" : "text-gray-500"
                              }`}
                            >
                              {ls.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Game Entry Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer"
              onClick={onNavigateToGame}
            ></motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="overflow-hidden flex flex-col">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">
                      {lesson.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {lesson.duration}
                    </CardDescription>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      completedLessons.includes(currentLesson)
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {completedLessons.includes(currentLesson)
                      ? "✓ Selesai"
                      : "Sedang Belajar"}
                  </motion.div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-5 md:p-7 relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentLesson}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* ── MATERI INTI & VIDEO TUTORIAL ── */}
                    {(lesson.type === "content" || lesson.type === "video") && (
                      <div className="space-y-5">
                        {/* Video Player - Langsung Tampil */}
                        {lesson.videoUrl && (
                          <div className="aspect-video bg-black rounded-2xl shadow-lg overflow-hidden relative">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${lesson.videoUrl.split("?")[0]}`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        )}

                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                          {lesson.description}
                        </p>

                        {/* Poin-poin Utama (Hanya untuk content) */}
                        {lesson.type === "content" && lesson.keyPoints && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <ListChecks className="w-5 h-5 text-indigo-600" />
                              <h3 className="font-semibold text-gray-900">
                                Poin-poin Utama
                              </h3>
                            </div>
                            <div className="space-y-2">
                              {lesson.keyPoints.map((point, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -16 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.07 }}
                                  className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                                >
                                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                    {i + 1}
                                  </span>
                                  <span className="text-sm text-gray-700">
                                    {point}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Steps to complete (Hanya untuk video tutorial) */}
                        {lesson.type === "video" && lesson.steps && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <ListChecks className="w-5 h-5 text-indigo-600" />
                              <h3 className="font-semibold text-gray-900">
                                Steps to complete
                              </h3>
                            </div>
                            <div className="space-y-3">
                              {lesson.steps.map((step, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.08 }}
                                  className="flex gap-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm"
                                >
                                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {step.num}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                      {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {step.desc}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {lesson.noteText && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setExpandedNote(!expandedNote)}
                              className="w-full flex items-center justify-between p-3 text-left"
                            >
                              <span className="text-sm font-medium text-amber-800">
                                📌 Tahukah Anda?
                              </span>
                              {expandedNote ? (
                                <ChevronUp className="w-4 h-4 text-amber-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-amber-600" />
                              )}
                            </button>
                            <AnimatePresence>
                              {expandedNote && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <p className="px-3 pb-3 text-sm text-amber-700">
                                    {lesson.noteText}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── EVALUASI ── */}
                    {lesson.type === "quiz" && (
                      <div className="space-y-5">
                        <p className="text-gray-700 text-sm md:text-base">
                          {lesson.description}
                        </p>

                        {!quizSubmitted ? (
                          <div className="space-y-5">
                            {lesson.questions?.map((q, qi) => (
                              <motion.div
                                key={qi}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: qi * 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                              >
                                <p className="font-medium text-gray-900 text-sm mb-3">
                                  {qi + 1}. {q.question}
                                </p>
                                <div className="space-y-2">
                                  {q.options.map((opt, oi) => (
                                    <button
                                      key={oi}
                                      onClick={() =>
                                        setSelectedAnswers({
                                          ...selectedAnswers,
                                          [qi]: oi,
                                        })
                                      }
                                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all border ${
                                        selectedAnswers[qi] === oi
                                          ? "bg-indigo-600 text-white border-indigo-600"
                                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                                      }`}
                                    >
                                      <span className="font-medium mr-2">
                                        {String.fromCharCode(65 + oi)}.
                                      </span>
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            ))}

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={handleQuizSubmit}
                                disabled={
                                  Object.keys(selectedAnswers).length !==
                                  (lesson.questions?.length ?? 0)
                                }
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                size="lg"
                              >
                                <ClipboardCheck className="w-4 h-4 mr-2" />
                                Submit Answers
                              </Button>
                            </motion.div>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-10 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200"
                          >
                            <div className="inline-flex p-4 bg-white rounded-full shadow-md mb-4">
                              <Award className="w-12 h-12 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              Quiz Completed!
                            </h3>
                            <p className="text-gray-600 mb-6">
                              You scored {quizScore} out of{" "}
                              {lesson.questions?.length}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center px-6">
                              <Button
                                onClick={() => {
                                  setSelectedAnswers({});
                                  setQuizSubmitted(false);
                                }}
                                variant="outline"
                              >
                                Try Again
                              </Button>
                              <Button
                                onClick={handleComplete}
                                className="bg-indigo-600 hover:bg-indigo-700"
                              >
                                {currentLesson === lessons.length - 1
                                  ? "Finish Module"
                                  : "Next Lesson"}
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>

              {/* Navigation Footer */}
              <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentLesson === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                <div className="flex items-center gap-2">
                  {lessons.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentLesson
                          ? "w-6 bg-indigo-600"
                          : completedLessons.includes(i)
                            ? "bg-green-400"
                            : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {lesson.type !== "quiz" ? (
                  <Button
                    onClick={handleComplete}
                    className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                  >
                    <span className="hidden sm:inline">
                      {completedLessons.includes(currentLesson)
                        ? "Next"
                        : "Complete & Next"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleNext}
                    disabled={currentLesson === lessons.length - 1}
                    className="gap-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
