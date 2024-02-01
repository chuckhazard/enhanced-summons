import { LOG } from "../util/logger"

const formatCr = (item) => {
  let cr = item?.system?.details?.cr || "-"
  if (cr === 0.125) cr = "&frac18;"
  if (cr === 0.25) cr = "&frac14;"
  if (cr === 0.5) cr = "&frac12;"
  return cr
}

const compareCr = (a, b) => {
  return a?.system?.details?.cr - b?.system?.details?.cr
}

const compareAttackRating = (a, b) => {
  if (a.atkRating === undefined) LOG.warn(`${a.name} maxToHit not indexed.`)
  if (b.atkRating === undefined) LOG.warn(`${b.name} maxToHit not indexed.`)
  LOG.debug(`${a.name}(${a.atkRating}) - ${b.name}(${b.atkRating})`)
  return b.atkRating - a.atkRating
}

const sizeOrder = { tiny: 0, sm: 1, med: 2, lg: 3, huge: 4, grg: 5 }
const compareSize = (a, b) => {
  let ai = a?.system?.traits?.size
  let bi = b?.system?.traits?.size
  if (!ai || sizeOrder[ai] === undefined || !bi || sizeOrder[bi] === undefined)
    return 0
  return sizeOrder[ai] - sizeOrder[bi]
}

const formatSize = (c) => {
  let size = c?.system?.traits?.size
  if (size === undefined) console.log("error: undefined size; " + c.name)

  if (size == "med") return "m"
  if (size == "sm") return "s"
  if (size == "tiny") return "t"
  if (size == "lg") return "L"
  if (size == "huge") return "H"
  if (size == "grg") return "G"
  return size
}

export const columns = []
Hooks.once("ready", () => {
  let columnDefinition =
    hfSummons.columnDefinition || foundrySummons.columnDefinition
  columns.push(columnDefinition("Name", (creature) => creature.name))
  columns.push(columnDefinition("Size", formatSize, compareSize))
  columns.push(
    columnDefinition("hp", (item) => item.system?.attributes?.hp?.value || "-")
  )
  columns.push(
    columnDefinition(
      "Val",
      (creature) => creature.atkRating || "-",
      compareAttackRating
    )
  )
  columns.push(columnDefinition("Hit", (creature) => creature.atkHit || "-"))
  columns.push(columnDefinition("Dmg", (creature) => creature.atkDmg || "-"))
  columns.push(columnDefinition("CR", formatCr, compareCr))
})
