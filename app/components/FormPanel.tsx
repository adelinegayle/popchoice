type FormState = {
  favoriteMovie: string;
  era: 'ANY' | 'CLASSIC' | 'MODERN';
  vibe: 'FUN' | 'CHILL' | 'SERIOUS';
};

type FormPanelProps = {
  form: FormState;
  onFormChange: (form: FormState) => void;
  onSubmit: () => void;
};

export default function FormPanel({ form, onFormChange, onSubmit }: FormPanelProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Your preferences</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="favoriteMovie" className="text-sm font-medium">
            Favourite movie (optional)
          </label>
          <textarea
            id="favoriteMovie"
            className="mt-1 w-full rounded border p-2"
            rows={3}
            value={form.favoriteMovie}
            onChange={(e)=>
              onFormChange({ ...form, favoriteMovie: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="era" className="text-sm font-medium">Era</label>
          <select
            id="era"
            className="mt-1 w-full rounded border p-2"
            value={form.era}
            onChange={(e)=>
              onFormChange({ ...form, era: e.target.value as FormState['era'] })
            }
          >
            <option value="ANY">Any</option>
            <option value="CLASSIC">Classic</option>
            <option value="MODERN">Modern</option>
          </select>
        </div>

        <div>
          <label htmlFor="vibe" className="text-sm font-medium">Vibe</label>
          <select
            id="vibe"
            className="mt-1 w-full rounded border p-2"
            value={form.vibe}
            onChange={(e)=>
              onFormChange({ ...form, vibe: e.target.value as FormState['vibe'] })
            }
          >
            <option value="FUN">Fun</option>
            <option value="CHILL">Chill</option>
            <option value="SERIOUS">Serious</option>
          </select>
        </div>

        <button
          onClick={onSubmit}
          className="w-full rounded bg-black py-2 text-white"
        >
          Recommend a movie
        </button>
      </div>
    </div>
  );
}
