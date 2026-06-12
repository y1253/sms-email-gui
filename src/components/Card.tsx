type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 ${className}`}>
      {children}
    </div>
  );
}
