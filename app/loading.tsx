export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cork-200 border-t-wine-red rounded-full animate-spin"></div>
        <p className="text-cork-300 text-lg">Cargando vinos...</p>
      </div>
    </div>
  );
}