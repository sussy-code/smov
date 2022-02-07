export interface ButtonControlProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ButtonControl({ onClick, children }: ButtonControlProps) {
  return <button onClick={onClick}>{children}</button>
}
