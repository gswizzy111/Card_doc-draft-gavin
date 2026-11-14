Generator for the pixel art in public/pixel and components/pixel/sprites.tsx.
art.mjs holds the ASCII pixel grids, scene.mjs the clinic layout. Run: node scripts/pixel-art/gen-tsx.mjs
(intermediate files go to $PIXEL_OUT, default /tmp/pixel-work/out). sprites.tsx is the source of truth if this drifts.
