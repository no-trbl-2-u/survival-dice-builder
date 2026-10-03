import type { Face } from '@survival/content'
import { DIE_FACES } from '@survival/engine'

/** three.js BoxGeometry material order: +X, -X, +Y (top), -Y, +Z, -Z. */
export const TOP = 2

/**
 * The face on each side of a 3D die so the engine's face lands on top: the rolled face goes on
 * +Y, the other 5 faces of the action die fill the other sides in die order. The die always
 * shows all 6 faces of the action die (rule 2.3); only which side holds which face changes.
 */
export function faceLayout(top: Face): Face[] {
  const rest = DIE_FACES.filter((f) => f !== top)
  return [rest[0], rest[1], top, rest[2], rest[3], rest[4]] as Face[]
}

/** One frame of a throw: rotation (radians, XYZ order) and height above the table. */
export type Pose = Readonly<{ x: number; y: number; z: number; height: number }>

/** A throw's shape: whole turns per axis, the final spin about the vertical, the drop height. */
export type Throw = Readonly<{ turnsX: number; turnsZ: number; yaw: number; drop: number }>

/**
 * A throw for die `die` of roll `roll`: varied but deterministic (no randomness, so the
 * animation never touches the game's RNG).
 */
export function throwFor(die: number, roll: number): Throw {
  const k = die * 7 + roll * 3
  return {
    turnsX: 2 + (k % 3),
    turnsZ: 1 + ((k + 1) % 2),
    yaw: ((k * 37) % 360) * (Math.PI / 180),
    drop: 2.2 + (k % 4) * 0.3,
  }
}

const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * The pose at time `t` (0..1). The die spins whole turns about X and Z and eases into rest, so
 * at t = 1 the rotation is exactly (0, yaw, 0): +Y, the engine's face, points up. The height
 * falls with 2 small bounces.
 */
export function poseAt(t: number, th: Throw): Pose {
  const u = Math.min(1, Math.max(0, t))
  const spin = 1 - easeOut(u)
  const fall = u < 0.55 ? 1 - (u / 0.55) ** 2 : 0
  const bounce =
    u >= 0.55 && u < 0.8
      ? 0.18 * Math.sin(((u - 0.55) / 0.25) * Math.PI)
      : u >= 0.8 && u < 0.95
        ? 0.06 * Math.sin(((u - 0.8) / 0.15) * Math.PI)
        : 0
  return {
    x: spin * th.turnsX * 2 * Math.PI,
    y: th.yaw + spin * Math.PI,
    z: spin * th.turnsZ * 2 * Math.PI,
    height: fall * th.drop + bounce,
  }
}
