export interface Bot {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: "bg-remover" | "pdf-to-docx" | "ai-chat";
}