import Image from "next/image";
import logo from "@/assets/logo-ssf.png";

export function Logo() {
  return <Image src={logo} alt="" className="logo" priority />;
}
