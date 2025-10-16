"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation";

import * as routes from "@/config/pages"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function request(
  url: string,
  data: { [key: string]: any; }
): Promise<{ result: number; message: string; data?: { [key: string]: any; } }> {
  data = {
    url: url,
    data: { ...data }
  }

  const res = await fetch('/api', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  let re = await res.json();
  if (re.result == 2) {
    window.location.href = "/login";
  }
  return re;
}

export async function download(
  url: string,
  fileName: string,
  data: { [key: string]: any; }
) {
  data = {
    url: url,
    data: { ...data }
  }

  const res = await fetch('/api', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const blob = await res.blob()
  const href = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = fileName
  a.click()
  a.remove()
}

export async function upload(
  url: string,
  file: File
) {
  try {
    const form = new FormData();
    form.append("url", url);
    form.append("file", file);

    const res = await fetch("/api", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("upload error");

    const data = await res.json();
    return data;

  } catch (err) {
    console.error(err);
  }
  return { result: 1, message: "Error!" };
}
