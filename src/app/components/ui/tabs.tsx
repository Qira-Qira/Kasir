import { createContext, useContext, type ReactNode } from "react";

const TabsContext = createContext<{ value: string; onValueChange: (value: string) => void }>({ value: "", onValueChange: () => {} });
export function Tabs({ value, onValueChange, children }: { value: string; onValueChange: (value: string) => void; children: ReactNode }) { return <TabsContext.Provider value={{ value, onValueChange }}><div>{children}</div></TabsContext.Provider>; }
export function TabsList({ className = "", children }: { className?: string; children: ReactNode }) { return <div className={`inline-flex items-center gap-1 rounded-md bg-muted p-1 ${className}`}>{children}</div>; }
export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) { const tabs = useContext(TabsContext); return <button type="button" className={`rounded px-3 py-1.5 text-sm ${tabs.value === value ? "bg-background shadow-sm" : "hover:bg-background/60"}`} onClick={() => tabs.onValueChange(value)}>{children}</button>; }
