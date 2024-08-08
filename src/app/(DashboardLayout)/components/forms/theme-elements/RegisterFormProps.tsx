export default interface RegisterFormProps {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNext: () => void;
    handlePrev: () => void;
    formData: any;
  }