'use client';

export default function AuthPrimaryButton({
  text,
  disabled,
}: {
  text: string;
  disabled?: boolean;
}) {
  return (
    <button className="primary" type="submit" disabled={disabled}>
      {text}
    </button>
  );
}
