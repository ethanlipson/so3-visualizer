## SO(3) Visualizer

Hosted at [https://so3-visualizer.vercel.app](https://so3-visualizer.vercel.app)

The Lie group SO(3) is not simply connected; it is impossible to deform a 360-degree loop into the identity rotation. It is, however, possible to deform a 720-degree loop into the identity, as this website demonstrates. Topologically, this is because SO(3) is double-covered by the group of unit quaternions Spin(3), which is simply connected. It may seem like the sudden change in the axis of rotation is a discontinuity, but all axes of rotation are equivalent at the identity (which is where the switch occurs), so this is allowed.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), with [Three.js](https://threejs.org/) used for the graphics.

### Controls

Drag to rotate the camera, although this can be disorienting. I feel the default orientation is best for understanding what's going on.

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
