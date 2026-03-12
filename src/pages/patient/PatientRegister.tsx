import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import StepAccount from "@/components/patient-register/StepAccount";
import StepPersonalData from "@/components/patient-register/StepPersonalData";
import StepInsurance from "@/components/patient-register/StepInsurance";
import StepProfile from "@/components/patient-register/StepProfile";

const steps = ["Account", "Persönliches", "Versicherung", "Profil"];

const PatientRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateFormData = (data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const stepComponents = [
    <StepAccount key="account" data={formData} update={updateFormData} onNext={next} />,
    <StepPersonalData key="personal" data={formData} update={updateFormData} onNext={next} onBack={back} />,
    <StepInsurance key="insurance" data={formData} update={updateFormData} onNext={next} onBack={back} />,
    <StepProfile key="profile" data={formData} update={updateFormData} onBack={back} />,
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {stepComponents[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientRegister;
