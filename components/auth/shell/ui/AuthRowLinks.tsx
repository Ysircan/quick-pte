'use client';

type LinkSpec = {
  text: string;
  onClick?: () => void;
};

export default function AuthRowLinks({
  left,
  right,
}: {
  left: LinkSpec;
  right: LinkSpec;
}) {
  return (
    <div className="row">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          left.onClick?.();
        }}
      >
        {left.text}
      </a>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          right.onClick?.();
        }}
      >
        {right.text}
      </a>
    </div>
  );
}
