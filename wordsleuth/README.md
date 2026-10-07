# Word Sleuth setup
npm create vite@latest wordsleuth -- --template react
cd wordsleuth
npm i framer-motion
npm i -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
# then replace/add the files from this folder (tailwind.config.js, index.html, src/*) and run:
npm run dev
