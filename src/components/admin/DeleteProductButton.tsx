"use client";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  productName: string;
  className?: string;
};

export function DeleteProductButton({ action, productName, className }: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${productName}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={
          className ??
          "rounded-full px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
        }
      >
        Delete
      </button>
    </form>
  );
}
