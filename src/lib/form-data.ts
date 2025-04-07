export function toFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    if (obj[key] === null) {
      formData.append(key, "_null");
    }

    if (obj[key] === undefined) {
      formData.append(key, "_undefined");
    }

    formData.append(key, obj[key]);
  }
  return formData;
}

export function fromFormData<T extends Record<string, any>>(data: T): T {
  const result = { ...data };

  for (const [key, value] of Object.entries(data)) {
    if (value === "_null") {
      // @ts-expect-error
      result[key] = null;
    } else if (value === "_undefined") {
      // @ts-expect-error
      result[key] = undefined;
    }
  }

  return result;
}
