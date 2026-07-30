### Task 2: Configure Beige Theme

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/theme-provider.tsx`

**Interfaces:**
- Consumes: nothing (pure theming)
- Produces: App shell with beige palette, light-only mode

- [ ] **Step 1: Replace `app/globals.css` with beige theme**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 20 6% 90%;
    --foreground: 60 3% 6%;
    --card: 0 0% 100%;
    --card-foreground: 60 3% 6%;
    --popover: 0 0% 100%;
    --popover-foreground: 60 3% 6%;
    --primary: 160 84% 39%;
    --primary-foreground: 0 0% 98%;
    --secondary: 60 5% 92%;
    --secondary-foreground: 60 3% 6%;
    --muted: 60 5% 92%;
    --muted-foreground: 25 5% 45%;
    --accent: 160 84% 39%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
    --border: 20 6% 85%;
    --input: 20 6% 85%;
    --ring: 160 84% 39%;
    --radius: 0.5rem;
    --chart-1: 160 84% 39%;
    --chart-2: 160 70% 50%;
    --chart-3: 160 60% 60%;
    --chart-4: 160 50% 70%;
    --chart-5: 160 40% 80%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-geist-sans, system-ui, sans-serif);
  }
}
```

- [ ] **Step 2: Create theme provider**

File `components/theme-provider.tsx`:

```tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" forcedTheme="light">
      {children}
    </NextThemesProvider>
  )
}
```

- [ ] **Step 3: Update `app/layout.tsx`**

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Calculadora de Investimentos",
  description: "Simule seus investimentos com juros compostos",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify theme**

Run `npm run dev`, confirm the page loads with beige background (no flash of dark mode).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: configure beige light theme with next-themes"
```
