import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type props = {
  href: string;
  children: React.ReactElement;
};

const ActiveNextLink = ({ href, children }: props) => {
  const router = useRouter();

  let className = children.props.className || "";
  if (router.pathname === href) {
    className = `${className} selected`;
  }

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>;
};

export default ActiveNextLink;
