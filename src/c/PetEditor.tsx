import { DefaultPet, type PetData } from "~/types";
import Dragoon from "./Dragoon";
import { useState } from "react";
import { dragoon_glasses } from "~/items";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";

export type PetEditorProps = {
  initalData?: PetData;
  onSave?: (newData: PetData) => void;
};

const PetEditor: React.FC<PetEditorProps> = ({ initalData, onSave }) => {
  const defaultData = initalData || DefaultPet;
  const [color, setColor] = useState<string | undefined>(undefined);
  const [glasses, setGlassesId] = useState<number | undefined>(undefined);

  const data: PetData = {
    color: color ?? defaultData.color,
    glasses: glasses ?? defaultData.glasses,
  };

  return (
    <section className="flex flex-col items-center">
      <h2>Pet Editor</h2>
      <Dragoon data={data} />

      <div className="flex flex-col">
        <label htmlFor="color">Color</label>
        <input
          name="color"
          type="color"
          value={data.color}
          onInput={(e) => setColor(e.currentTarget.value)}
        />
        <select
          name="glasses"
          id="glasses"
          value={data.glasses.toString()}
          onInput={(e) => setGlassesId(parseInt(e.currentTarget.value))}
        >
          {dragoon_glasses.map((item, i) => {
            return (
              <option key={i} value={i.toString()}>
                {item.name}
              </option>
            );
          })}
        </select>
        <SignedIn>
          <button
            className="rounded-md border border-black p-2 hover:bg-slate-100"
            onClick={() => {
              onSave?.(data);
            }}
          >
            Save
          </button>
        </SignedIn>
        <SignedOut>
          <p>You need to be logged in to save changes to your pet.</p>
        </SignedOut>
      </div>
    </section>
  );
};

export default PetEditor;
