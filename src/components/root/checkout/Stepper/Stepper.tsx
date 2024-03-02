import React from "react";
import "./Stepper.css";
import { TiTick } from "react-icons/ti";

interface StepperProps {
  steps: string[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  complete: boolean;
  setComplete: React.Dispatch<React.SetStateAction<boolean>>;
}
const Stepper = ({ steps, currentStep, complete }: StepperProps) => {
  return (
    <>
      <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-600 text-sm mt-1">{step}</p>
          </div>
        ))}
      </div>
     
    </>
  );
};

export default Stepper;
