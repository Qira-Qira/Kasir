import { createContext, useContext, type InputHTMLAttributes, type ReactNode } from "react";

const RadioContext = createContext<{ value: string; onValueChange: (value: string) => void }>({ value: "", onValueChange: () => {} });
interface RadioGroupProps { value: string; onValueChange: (value: string) => void; className?: string; children: ReactNode; }
export function RadioGroup({ value, onValueChange, className = "", children }: RadioGroupProps) { return <RadioContext.Provider value={{ value, onValueChange }}><div className={className}>{children}</div></RadioContext.Provider>; }
interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> { value: string; }
export function RadioGroupItem({ value, ...props }: RadioGroupItemProps) { const group = useContext(RadioContext); return <input type="radio" checked={group.value === value} onChange={() => group.onValueChange(value)} {...props} />; }
