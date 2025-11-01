"use client"

import { useRouter } from "next/navigation";

import * as routes from "@/config/pages"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ResponseModel } from "../models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function request<T = unknown>(
  url: string,
  data: { [key: string]: unknown; }
): Promise<ResponseModel<T>> {
  data = {
    url: url,
    data: { ...data }
  }
  const res = await fetch('/api', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const re: ResponseModel<T> = await res.json();
  if (re.result == 2) {
    window.location.href = "/login";
  }
  if (re.result == 403) {
    window.location.href = "/error-page/p403";
  }
  return re;
}

export async function download(
  url: string,
  fileName: string,
  data: { [key: string]: unknown; }
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
  catalog: string,
  file: File
) {
  try {
    const form = new FormData();
    form.append("url", url);
    form.append("catalog", catalog);
    form.append("file", file);

    const res = await fetch("/api", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("upload error");

    const data = await res.json();
    if (data.result == 2) {
      window.location.href = "/login";
    }
    if (data.result == 403) {
      window.location.href = "/error-page/p403";
    }
    return data;

  } catch (err) {
    console.error(err);
  }
  return { result: 1, message: "Error!" };
}
