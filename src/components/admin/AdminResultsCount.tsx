interface AdminResultsCountProps {
  count: number;
  isLoading?: boolean;
  label?: string;
}

export const AdminResultsCount = ({ count, isLoading, label = "תוצאות" }: AdminResultsCountProps) => {
  if (isLoading) return null;
  
  return (
    <p className="text-base text-muted-foreground hebrew-text">
      {count.toLocaleString('he-IL')} {label}
    </p>
  );
};
