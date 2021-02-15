interface IFromErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFromErrorProps> = ({ errorMessage }) => (
  <span className="font-medium text-red-500">{errorMessage}</span>
);
