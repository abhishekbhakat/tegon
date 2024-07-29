import type { IconProps } from './types';

export function CodingLine({ size = 18, className, color }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5669 4.15221C11.967 4.25941 12.2044 4.67067 12.0972 5.07077L9.35167 15.3172C9.24447 15.7173 8.83321 15.9547 8.43312 15.8475C8.03302 15.7403 7.79558 15.329 7.90278 14.9289L10.6483 4.68254C10.7555 4.28244 11.1668 4.045 11.5669 4.15221ZM6.03019 5.9336C6.32308 6.2265 6.32308 6.70137 6.03019 6.99426L3.02413 10.0003L6.02933 13.0055C6.32223 13.2984 6.32223 13.7733 6.02933 14.0662C5.73644 14.3591 5.26157 14.3591 4.96867 14.0662L1.43314 10.5307C1.14025 10.2378 1.14025 9.76289 1.43314 9.46999L4.96953 5.9336C5.26242 5.64071 5.7373 5.64071 6.03019 5.9336ZM13.9686 5.9336C14.2615 5.64071 14.7364 5.64071 15.0293 5.9336L18.5657 9.46999C18.7063 9.61064 18.7854 9.80141 18.7854 10.0003C18.7854 10.1992 18.7063 10.39 18.5657 10.5307L15.0302 14.0662C14.7373 14.3591 14.2624 14.3591 13.9695 14.0662C13.6766 13.7733 13.6766 13.2984 13.9695 13.0055L16.9747 10.0003L13.9686 6.99426C13.6758 6.70137 13.6758 6.2265 13.9686 5.9336Z"
        fill={color ? color : 'currentColor'}
      />
    </svg>
  );
}