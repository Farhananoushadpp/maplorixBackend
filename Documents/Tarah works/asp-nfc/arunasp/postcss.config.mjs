import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNesting from "postcss-nesting";
import postcssCustomProperties from "postcss-custom-properties";
import postcssPresetEnv from "postcss-preset-env";

export default {
  plugins: [
    postcssImport(),
    tailwindcss(),
    autoprefixer(),
    postcssNesting(),
    postcssCustomProperties(),
    postcssPresetEnv({
      stage: 1,
      features: {
        "nesting-rules": true,
        "custom-properties": true,
        keyframes: true,
      },
    }),
  ],
};
