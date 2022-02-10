export interface ButtonControlProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function ButtonControl({ onClick, children, className }: ButtonControlProps) {
  return <button onClick={onClick} className={className}>{children}</button>
}
