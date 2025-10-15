interface ResultsCountProps {
  count: number;
  isLoading?: boolean;
}

export const ResultsCount = ({ count, isLoading }: ResultsCountProps) => {
  if (isLoading) return null;
  
  return (
    <p className="text-sm text-muted-foreground hebrew-text">
      נמצאו {count.toLocaleString('he-IL')} רכבים
    </p>
  );
};
