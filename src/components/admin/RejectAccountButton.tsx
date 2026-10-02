"use client";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  accountName: string;
};

export function RejectAccountButton({ action, accountName }: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Reject and permanently delete the account request for ${accountName}?`)) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50">
        Reject &amp; delete
      </button>
    </form>
  );
}