import React, { useState } from "react";
import EventStepOne from "./EventStepOne";
import EventStepTwo from "./EventStepTwo";

export default function EventCreate({ onCancel }) {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {step === 1 && (
        <EventStepOne
          onCancel={onCancel}
          onNext={(data) => {
            setEventData(data);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <EventStepTwo
          eventData={eventData}
          onBack={() => setStep(1)}
          onSubmit={() => {
            console.log("FINAL DATA:", eventData);
            onCancel(); // kembali ke list
          }}
        />
      )}
    </div>
  );
}
