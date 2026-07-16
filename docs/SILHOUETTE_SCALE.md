# Forest silhouette scale

The Forest exhibit uses a standing adult human of **1.70 m** as the fixed
reference. Animals are scaled by typical adult shoulder height—not head,
ear, or antler height.

| Species | Display shoulder height | Adult reference range |
| --- | ---: | ---: |
| Moose | 1.90 m | about 1.8–2.0 m |
| Black bear | 0.77 m | about 0.5–1.0 m |
| Grey wolf | 0.69 m | about 0.61–0.76 m |
| Woodland caribou | 1.10 m | 1.0–1.2 m |
| White-tailed deer | 0.90 m | about 0.79–0.99 m |
| Canada lynx | 0.52 m | about 0.48–0.56 m |

Primary references:

- Parks Canada, Pukaskwa National Park: moose stand almost 2 m at the shoulder.
- Ontario and Environment and Climate Change Canada: boreal woodland caribou
  stand 1.0–1.2 m at the shoulder.
- International Association for Bear Research and Management: adult black
  bear shoulder height spans 0.5–1.0 m; reported adult means are approximately
  0.73 m for females and 0.81 m for males.

The PNG artwork also has an anatomical shoulder landmark. Full artwork height
is calculated as:

`human display height × animal shoulder height ÷ 1.70 m ÷ artwork shoulder proportion`

This distinction matters for antlered species. An alpha scan cannot identify a
shoulder reliably because antlers may overlap the torso columns. The woodland
caribou landmark is 0.572 of full artwork height; the former 0.87 value made its
body roughly one-third too short.

Run `npm run audit:scale` after replacing or trimming any silhouette PNG.
