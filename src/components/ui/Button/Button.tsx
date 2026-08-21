import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function Button({ children, onClick, type = "button" }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className="primary-button">
      {children}
    </button>
  );
}
