'use client';

type Props = {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
};

export default function AuthField({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
}: Props) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
  id={id}
  name={id}   // ✅ 新增这一行：FormData 才能取到
  type={type}
  placeholder={placeholder}
  autoComplete={autoComplete}
/>

    </div>
  );
}
