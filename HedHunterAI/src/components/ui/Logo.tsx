import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  height?: number;
  href?: string;
  className?: string;
}

export function Logo({ height = 36, href = "/", className }: LogoProps) {
  const width = Math.round(height * 1.5); // 3:2 native ratio

  const img = (
    <Image
      src="/logo.png"
      alt="Hed Hunter AI"
      width={width}
      height={height}
      priority
      className={className}
      style={{ objectFit: "contain" }}
    />
  );

  if (!href) return img;
  return <Link href={href} style={{ display: "inline-flex", alignItems: "center" }}>{img}</Link>;
}
