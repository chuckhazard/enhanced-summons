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

export const columns = []
Hooks.once("ready", () => {
  let columnDefinition = foundrySummons.columnDefinition
  columns.push(columnDefinition("name", (creature) => creature.name))
  columns.push(
    columnDefinition("hp", (item) => item.system?.attributes?.hp?.value || "-")
  )
  columns.push(
    columnDefinition(
      "Rating",
      (creature) => creature.atkRating || "-",
      compareAttackRating
    )
  )
  columns.push(columnDefinition("Hit", (creature) => creature.atkHit || "-"))
  columns.push(columnDefinition("Dmg", (creature) => creature.atkDmg || "-"))
  columns.push(columnDefinition("CR", formatCr, compareCr))
})
