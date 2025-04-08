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
import { Button, Text } from "@radix-ui/themes";
import { cn, formatFileSize } from "@/lib/client/utils";

type Props = {
  upload: File | null | undefined;
  setUpload: (file: File | null) => void;
};

const ImageDropzone: React.FC<Props> = ({ upload, setUpload }) => {
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

  return (
    <div
      ref={ref}
      data-testid="drop-target"
      className={cn(
        "flex items-center justify-center gap-4 rounded-3 border border-gray-6 bg-gray-3 p-4",
        "transition-colors ease-out",
        {
          "border-gray-7": state === "potential",
          "border-gray-8 bg-gray-4": state === "over",
        },
      )}
    >
      {imageUrl && upload ? (
        <section className="flex w-full items-center gap-4">
          <div className="size-16 rounded-2 bg-[white] p-0.5">
            <img
              src={imageUrl}
              alt={upload.name}
              className="size-full object-contain"
            />
          </div>
          <div className="grid flex-1 gap-2">
            <section className="grid">
              <Text size="2">{upload.name}</Text>
              <Text size="1" color="gray">
                {formatFileSize(upload.size)}
              </Text>
            </section>
            <Button
              type="button"
              color="red"
              variant="soft"
              onClick={() => setUpload(null)}
            >
              Remove Image
            </Button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <Text size="2" color="gray">
            Drag and drop or select an image
          </Text>
          <Button type="button" variant="soft" onClick={onInputTriggerClick}>
            Select images
          </Button>
        </section>
      )}

      <input
        ref={inputRef}
        className="hidden"
        id="file-input"
        onChange={onFileInputChange}
        type="file"
        accept="image/*"
      />
    </div>
  );
};

export default ImageDropzone;
