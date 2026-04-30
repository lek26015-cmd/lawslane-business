import { B2BSurveyForm } from '@/components/forms/b2b-survey-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Legal Operations Survey | Lawslane',
  description: 'Help us understand your legal workflow challenges so we can tailor our solution to your needs.',
};

export default function B2BSurveyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:py-24">
      <B2BSurveyForm />
    </div>
  );
}
