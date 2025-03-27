import React from "react";
import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  dropTargetForExternal,
  monitorForExternal,
} from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import {
  containsFiles,
  getFiles,
} from "@atlaskit/pragmatic-drag-and-drop/external/file";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

type Props = {
  upload: File | null | undefined;
  setUpload: (file: File | null) => void;
};

export default function useImageDropzone({ upload, setUpload }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [state, setState] = React.useState<"idle" | "potential" | "over">(
    "idle",
  );

  const imageUrl = React.useMemo(
    () => (upload ? URL.createObjectURL(upload) : null),
    [upload],
  );

  const addUpload = React.useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setUpload(file);
  }, []);

  const onFileInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.currentTarget.files ?? []);
      addUpload(files[0]);
    },
    [addUpload],
  );

  React.useEffect(() => {
    const el = ref.current;
    invariant(el);
    return combine(
      dropTargetForExternal({
        element: el,
        canDrop: containsFiles,
        onDragEnter: () => setState("over"),
        onDragLeave: () => setState("potential"),
        onDrop: async ({ source }) => {
          const files = getFiles({ source });
          setUpload(files[0]);
        },
      }),
      monitorForExternal({
        canMonitor: containsFiles,
        onDragStart: () => {
          setState("potential");
          preventUnhandled.start();
        },
        onDrop: () => {
          setState("idle");
          preventUnhandled.stop();
        },
      }),
    );
  });

  /**
   * We trigger the file input manually when clicking the button. This also
   * works when selecting the button using a keyboard.
   *
   * We do this for two reasons:
   *
   * 1. Styling file inputs is very limited.
   * 2. Associating the button as a label for the input only gives us pointer
   *    support, but does not work for keyboard.
   */
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onInputTriggerClick = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const HiddenInput = (
    <input
      ref={inputRef}
      className="hidden"
      id="file-input"
      onChange={onFileInputChange}
      type="file"
      accept="image/*"
    />
  );

  return {
    ref,
    state,
    imageUrl,
    onInputTriggerClick,
    HiddenInput,
  };
}
