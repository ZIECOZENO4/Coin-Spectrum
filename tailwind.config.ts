const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // fontSize: {
      //   xs: ['0.75rem', { lineHeight: '1rem' }],
      //   sm: ['0.875rem', { lineHeight: '1.25rem' }],
      //   base: ['1rem', { lineHeight: '1.5rem' }], // default font size and line height
      //   lg: ['1.125rem', { lineHeight: '1.75rem' }],
      //   xl: ['1.25rem', { lineHeight: '1.75rem' }],
      //   '2xl': ['1.5rem', { lineHeight: '2rem' }],
      //   '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      //   '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      //   '5xl': ['3rem', { lineHeight: '1' }],
      //   '6xl': ['3.75rem', { lineHeight: '1' }],
      //   '7xl': ['4.5rem', { lineHeight: '1' }],
      //   '8xl': ['6rem', { lineHeight: '1' }],
      //   '9xl': ['8rem', { lineHeight: '1' }],
      // },
      // // Override font weights here
      // fontWeight: {
      //   thin: 100,
      //   extralight: 200,
      //   light: 300,
      //   normal: 400, // default font weight
      //   medium: 500,
      //   semibold: 600,
      //   bold: 700,
      //   extrabold: 800,
      //   black: 900,
      // },
      // // Override line heights here
      // lineHeight: {
      //   none: '1',
      //   tight: '1.25',
      //   snug: '1.375',
      //   normal: '1.5', // default line height
      //   relaxed: '1.625',
      //   loose: '2',
      //   3: '.75rem',
      //   4: '1rem',
      //   5: '1.25rem',
      //   6: '1.5rem',
      //   7: '1.75rem',
      //   8: '2rem',
      //   9: '2.25rem',
      //   10: '2.5rem',
      // },
      fontSize: {
        xxs: [".5rem", { lineHeight: "0.8rem" }],
        xs: ["0.64rem", { lineHeight: "1rem" }], // 80% of 0.75rem
        sm: ["0.8rem", { lineHeight: "1.25rem" }], // 80% of 0.875rem
        base: ["0.8rem", { lineHeight: "1.5rem" }], // 80% of 1rem
        lg: ["0.9rem", { lineHeight: "1.75rem" }], // 80% of 1.125rem
        xl: ["1rem", { lineHeight: "1.75rem" }], // 80% of 1.25rem
        "2xl": ["1.2rem", { lineHeight: "2rem" }], // 80% of 1.5rem
        "3xl": ["1.5rem", { lineHeight: "2.25rem" }], // 80% of 1.875rem
        "4xl": ["1.8rem", { lineHeight: "2.5rem" }], // 80% of 2.25rem
        "5xl": ["2.4rem", { lineHeight: "1" }], // 80% of 3rem
        "6xl": ["3rem", { lineHeight: "1" }], // 80% of 3.75rem
        "7xl": ["3.6rem", { lineHeight: "1" }], // 80% of 4.5rem
        "8xl": ["4.8rem", { lineHeight: "1" }], // 80% of 6rem
        "9xl": ["6rem", { lineHeight: "1" }], // 80% of 8rem
      },
      fontWeight: {
        // Tailwind's default font weights are not percentage-based and typically don't need adjustment.
        // However, you can customize them here if needed.
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'bg-hero-pattern': "url(/images/herobg.png)",
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
        3: ".75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
      },
      screens: {
        xs: "400px", // Custom breakpoint between very small and small
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
