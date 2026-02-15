type View = "FORM" | "LOADING" | "RESULT" | "ERROR";

type ResultPanelProps = {
  view: View;
  recommendation: string;
  error: string;
  onReset: () => void;
};

export default function ResultPanel({ view, recommendation, error, onReset }: ResultPanelProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Recommendation</h2>

      {view === "FORM" && (
        <p className="mt-4 text-gray-500">
          Fill the form and click recommend.
        </p>
      )}

      {view === "LOADING" && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
            <p className="text-gray-600">Finding the perfect movie...</p>
          </div>
        </div>
      )}

      {view === "ERROR" && (
        <div className="mt-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={onReset}
            className="mt-4 rounded border px-3 py-1"
          >
            Try again
          </button>
        </div>
      )}

      {view === "RESULT" && (
        <div className="mt-4">
          <div className="whitespace-pre-wrap text-gray-700">
            {recommendation}
          </div>

          <button
            onClick={onReset}
            className="mt-4 rounded border px-3 py-1 hover:bg-gray-50"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
