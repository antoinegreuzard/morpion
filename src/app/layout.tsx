import "./globals.css";
import React from "react";

export default function RootLayout(
  {children}: Readonly<{ children: React.ReactNode; }>
) {
  return (
    <html lang="fr">
    <body className="bg-gray-100">{children}</body>
    </html>
  );
}
