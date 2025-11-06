import React, { useState } from 'react';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import Step1_Category from '../components/booking/Step1_Category';
import Step2_Service from '../components/booking/Step2_Service';
import Step3_Employee from '../components/booking/Step3_Employee';
import Step4_DateTime from '../components/booking/Step4_DateTime';
import Step5_CustomerInfo from '../components/booking/Step5_CustomerInfo';
import Step6_Review from '../components/booking/Step6_Review';
import BookingSummary from '../components/booking/BookingSummary';
import { useBooking } from '../hooks/useBooking';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';

const steps = ["Category", "Service", "Stylist", "Schedule", "Confirm"];

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { bookingState, resetBooking, deselectService, deselectEmployee, deselectDateTime, deselectCustomerInfo } = useBooking();
  const { addBooking } = useData();
  const { user } = useAuth();
  // FIX: Replaced useHistory with useNavigate for v6+.
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => {
    // Clear state for the step we are leaving
    if (currentStep === 4) deselectCustomerInfo();
    if (currentStep === 3) deselectDateTime();
    if (currentStep === 2) deselectEmployee();
    if (currentStep === 1) deselectService();
    setCurrentStep(prev => prev - 1);
  };
  
  const goToStep = (step: number) => {
    if (step < currentStep) {
      // Reset state progressively when jumping back multiple steps
      if (step < 4) deselectCustomerInfo();
      if (step < 3) deselectDateTime();
      if (step < 2) deselectEmployee();
      if (step < 1) deselectService();
      setCurrentStep(step);
    }
  };

  const handleBookingConfirmed = async () => {
    if (!bookingState.service || !bookingState.variant || !bookingState.date || !bookingState.time || !bookingState.customerInfo || !user || !bookingState.paymentMethod) {
        alert("Something went wrong, please start over.");
        resetBooking();
        // FIX: Use navigate for navigation.
        navigate('/');
        return;
    }
    setIsSubmitting(true);

    const date = bookingState.date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const newBookingData = {
        customerId: user.id,
        customerInfo: bookingState.customerInfo,
        serviceId: bookingState.service.id,
        serviceName: bookingState.service.name,
        variantName: bookingState.variant.name,
        employeeId: bookingState.employee?.id || 'any', // This needs to be resolved before this step
        employeeName: bookingState.employee?.name || 'Any Available',
        appointmentDate: formattedDate,
        appointmentTime: bookingState.time,
        duration: bookingState.variant.duration,
        price: bookingState.variant.price,
        status: 'confirmed' as const,
        paymentMethod: bookingState.paymentMethod,
        paymentStatus: (bookingState.paymentMethod === 'cash' ? 'pending' : 'paid') as 'pending' | 'paid',
    };
    
    const newBooking = await addBooking(newBookingData);
    
    if (newBooking) {
        console.log('Booking confirmed:', newBooking);
        // FIX: Use navigate for navigation, passing state.
        navigate('/confirmation', { state: { booking: newBooking } });
    } else {
        // Handle booking failure (e.g., slot taken)
        // The error alert is shown in DataContext, we can just reset here
        alert("Could not complete booking. The selected time slot may have just been taken. Please try another time.");
        // Go back to the date/time step
        goToStep(3); 
    }
    setIsSubmitting(false);
  };
  
  const stepTitles = [
    "Step 1: Select a Category",
    "Step 2: Choose Your Service",
    "Step 3: Pick a Stylist",
    "Step 4: Schedule Your Appointment",
    "Step 5: Confirm Your Details"
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1_Category onCategorySelect={nextStep} />;
      case 1: return <Step2_Service onNext={nextStep} onBack={prevStep} />;
      case 2: return <Step3_Employee onNext={nextStep} onBack={prevStep} />;
      case 3: return <Step4_DateTime onNext={nextStep} onBack={prevStep} />;
      case 4: return <Step5_CustomerInfo onNext={nextStep} onBack={prevStep} />;
      case 5: return <Step6_Review onConfirm={handleBookingConfirmed} onBack={prevStep} isSubmitting={isSubmitting} />;
      default: return <Step1_Category onCategorySelect={nextStep} />;
    }
  };
  
  const showSummary = currentStep > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
            <div className="mb-12 mt-4 flex justify-center">
                <StepIndicator steps={steps} currentStep={currentStep} />
            </div>
            <h2 className="text-2xl font-bold text-center text-brand-dark mb-2">{stepTitles[currentStep]}</h2>
            <p className="text-center text-gray-500 mb-8">
              {currentStep === 0 && "Please select a service category to begin."}
              {currentStep > 0 && `Selected Category: ${bookingState.category?.name}`}
            </p>
            {renderStep()}
        </div>

        <div className="lg:col-span-1">
            {showSummary && <BookingSummary goToStep={goToStep}/>}
        </div>
    </div>
  );
};

export default BookingPage;
