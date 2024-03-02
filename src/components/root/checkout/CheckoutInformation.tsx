/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from "react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree, { StepThreeRef } from "./steps/StepThree";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShippingInformationSchema } from "../../../schemas";
import Stepper from "./Stepper/Stepper";
import Button from "../../layout/buttons/Button";


// eslint-disable-next-line react-refresh/only-export-components
export const steps = ["Shipping", "Summary", "Payment"];

export interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

type Schema = z.infer<typeof ShippingInformationSchema>;
const CheckoutInformation = () => {
  const paymentRef = useRef<StepThreeRef>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  

  const handleStep = () => {
    currentStep === steps.length
      ? setComplete(true)
      : setCurrentStep((prev) => prev + 1);
  };

  const prevStep = useCallback(() => {
    currentStep === 1 ? setComplete(false) : setCurrentStep((prev) => prev - 1);
  }, [currentStep]);

  const { handleSubmit, control, setValue, getValues } =
    useForm<Schema>({
      resolver: zodResolver(ShippingInformationSchema),
    });

  const onSubmit = (data: Schema) => {
    console.log(data);

    handleStep();
  };

  const STEPS: any = {
    1: <StepOne control={control} setValue={setValue} getValues={getValues} />,
    2: <StepTwo getValues={getValues} />,
    3: <StepThree getValues={getValues} ref={paymentRef} />,
  };

  const Step = STEPS[currentStep];

  return (
    <div className="w-full">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        complete={complete}
        setComplete={setComplete}
      />

      <div className="my-6 bg-white p-4 shadow rounded-md">{Step}</div>

      <div
        className={`mt-8 flex items-center ${
          currentStep === 1 ? "justify-end" : "justify-between"
        } w-full`}
      >
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="px-8 py-3 rounded-md border border-gray-300 text-sm text-center"
          >
            Prev
          </button>
        )}
        <div>
          <Button
            label={currentStep === steps.length ? "Submit" : "Continue"}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutInformation;
